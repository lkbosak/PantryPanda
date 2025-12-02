import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return await this.usersRepository.save(createUserDto);
    }

    findAll() {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User | null > {
        return this.usersRepository.findOneBy({ user_id: id })
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
        await this.usersRepository.update(id, updateUserDto);
        return this.usersRepository.findOneBy({ user_id: id });
    }

    async remove(id: number) {
        console.log('Attempting to permanently delete user account:', id);
        
        // First verify the user exists
        const user = await this.usersRepository.findOneBy({ user_id: id });
        if (!user) {
            console.warn('User not found for deletion:', id);
            throw new NotFoundException('User not found');
        }

        console.log('User found, permanently deleting:', { 
            user_id: user.user_id, 
            username: user.username, 
            email: user.email 
        });

        // Permanently delete the user record from the database
        // This removes username, password, email, and all other user data
        const result = await this.usersRepository.delete(id);
        
        if(result.affected === 0){
            console.error('Failed to delete user:', id);
            throw new NotFoundException('Failed to delete user');
        }
        
        console.log('User account permanently deleted and scrubbed from database:', id);
        console.log('Username, password, and email are now completely removed and inaccessible');
        
        return { message: 'Account permanently deleted', deleted: true };
    }

async login(loginUserDto: LoginUserDto): Promise<Partial<User>> {
    const { username, email, password } = loginUserDto;
    console.log('Login attempt:', loginUserDto);
    console.log('test in login')

    if (!password || (!username && !email)) {
        console.warn('Missing credentials');
        throw new UnauthorizedException('Missing credentials');
    }

    let user;
    try {
        user = await this.usersRepository.findOneBy(
            username ? { username } : { email }
        );
        console.log('Found user:', user);
    } catch (err) {
        console.error('Database query failed:', err);
        throw err; // Will return 500
    }

    if (!user) {
        console.warn('User not found');
        throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password !== password) {
        console.warn('Password mismatch');
        throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _pw, ...safeUser } = user as any;
    console.log('Login successful:', safeUser);
    return safeUser;
}

async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { user_id, currentPassword, newPassword } = changePasswordDto;

    console.log('Password change attempt for user:', user_id);

    // Find the user
    const user = await this.usersRepository.findOneBy({ user_id });

    if (!user) {
        console.warn('User not found for password change');
        throw new NotFoundException('User not found');
    }

    // Verify current password
    if (user.password !== currentPassword) {
        console.warn('Current password incorrect');
        throw new UnauthorizedException('Current password is incorrect');
    }

    // Update to new password (completely replacing the old one)
    await this.usersRepository.update(user_id, { password: newPassword });

    console.log('Password successfully changed for user:', user_id);
    
    return { message: 'Password successfully changed' };
}

async changeUsername(changeUsernameDto: ChangeUsernameDto): Promise<{ message: string; newUsername: string }> {
    const { user_id, currentPassword, newUsername } = changeUsernameDto;

    console.log('Username change attempt for user:', user_id);

    // Find the user
    const user = await this.usersRepository.findOneBy({ user_id });

    if (!user) {
        console.warn('User not found for username change');
        throw new NotFoundException('User not found');
    }

    // Verify password for security
    if (user.password !== currentPassword) {
        console.warn('Password incorrect for username change');
        throw new UnauthorizedException('Password is incorrect');
    }

    // Check if new username is already taken
    const existingUser = await this.usersRepository.findOneBy({ username: newUsername });
    if (existingUser && existingUser.user_id !== user_id) {
        console.warn('Username already taken:', newUsername);
        throw new UnauthorizedException('Username is already taken');
    }

    // Update to new username (completely replacing the old one)
    await this.usersRepository.update(user_id, { username: newUsername });

    console.log('Username successfully changed for user:', user_id, 'to:', newUsername);
    
    return { message: 'Username successfully changed', newUsername };
}

}
