import { Injectable, NotFoundException } from '@nestjs/common';
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
}
