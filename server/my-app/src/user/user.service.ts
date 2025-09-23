import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { create } from 'domain';

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
        await this.usersRepository.save({ user_id: id, updateUserDto });
        return this.usersRepository.findOneBy({ user_id: id });
    }

    async remove(id: number) {
        await this.usersRepository.delete({ user_id: id });
    }
}
