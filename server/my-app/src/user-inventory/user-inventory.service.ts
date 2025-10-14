import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInventoryDto } from './dto/create-user-inventory.dto';
import { UpdateUserInventoryDto } from './dto/update-user-inventory.dto';
import { Repository } from 'typeorm';
import { UserInventory } from './entities/user-inventory.entity';

@Injectable()
export class UserInventoryService {
    constructor(
        private readonly inventoryRepository: Repository<UserInventory>,
    ){}
    async create(dto: CreateUserInventoryDto) {
        return this.inventoryRepository.save({
            quantity: dto.quantity,
            unit: dto.unit,
            expiration_date: dto.expiration_date,
            date_added: dto.date_added,
            location: dto.location,
            qPref: dto.qPref,
            product: { product_id: dto.product_id }, 
        });
    }

    async findOne(id: number) {
        return await this.inventoryRepository.findOneBy({inventory_id: id});
    }

    async update(id: number, updateUserInventoryDto: UpdateUserInventoryDto) {
        await this.inventoryRepository.update(id, updateUserInventoryDto);
        return this.inventoryRepository.findOneBy({ inventory_id: id });
    }
    async remove(id: number) {
        const result = await this.inventoryRepository.delete(id)
        if(result.affected === 0){
            throw new NotFoundException;
        }
        return null;
    }
}

