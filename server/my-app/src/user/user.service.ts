import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const newUser = new User();
        newUser.email = createUserDto.email;
        newUser.username = createUserDto.username;
        newUser.password = createUserDto.password;
        newUser.accountCreated = createUserDto.accountCreated;
        return await this.usersRepository.save(newUser); //saves user in the user table

    }

    findAll() {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User | null > {
        return this.usersRepository.findOneBy({ user_id: id })
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
