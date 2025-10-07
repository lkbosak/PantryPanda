import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInventoryDto } from './dto/create-user-inventory.dto';
import { UpdateUserInventoryDto } from './dto/update-user-inventory.dto';
import { Repository } from 'typeorm';
import { UserInventory } from './entities/user-inventory.entity';

@Injectable()
export class UserInventoryService {
    constructor(
        private inventoryRepository: Repository<UserInventory>
    ){}
  async create(createUserInventoryDto: CreateUserInventoryDto) {
    return await this.inventoryRepository.save(createUserInventoryDto);
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

