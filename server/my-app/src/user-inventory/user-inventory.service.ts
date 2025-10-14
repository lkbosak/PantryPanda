import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInventoryDto } from './dto/create-user-inventory.dto';
import { UpdateUserInventoryDto } from './dto/update-user-inventory.dto';
import { Repository } from 'typeorm';
import { UserInventory } from './entities/user-inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserInventoryService {
    constructor(
        @InjectRepository(UserInventory)
        private readonly inventoryRepository: Repository<UserInventory>,
    ) {}

    // Return all inventory entries. Include related user and product for convenience.
    async findAll() {
        return await this.inventoryRepository.find({ relations: ['user', 'product'] });
    }

    // Create from DTO. Map product relation by id so TypeORM links the relation.
    async create(dto: CreateUserInventoryDto) {
        return await this.inventoryRepository.save({
            quantity: dto.quantity,
            unit: dto.unit,
            expiration_date: dto.expiration_date,
            date_added: dto.date_added,
            location: dto.location,
            qPref: dto.qPref,
            // product relation as partial object with id
            product: dto.product_id ? { product_id: dto.product_id } as any : undefined,
        } as Partial<UserInventory>);
    }

    async findOne(id: number) {
        return await this.inventoryRepository.findOneBy({ inventory_id: id });
    }

    async update(id: number, updateUserInventoryDto: UpdateUserInventoryDto) {
        await this.inventoryRepository.update(id, updateUserInventoryDto);
        return this.inventoryRepository.findOneBy({ inventory_id: id });
    }

    async remove(id: number) {
        const result = await this.inventoryRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException();
        }
        return null;
    }
}

