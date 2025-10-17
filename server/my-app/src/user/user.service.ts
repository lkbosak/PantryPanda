import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';

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
        const result = await this.usersRepository.delete(id)
        if(result.affected === 0){
            throw new NotFoundException;
        }
        return null;
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

}
