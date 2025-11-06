import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroceryListDto } from './dto/create-grocery-list.dto';
import { UpdateGroceryListDto } from './dto/update-grocery-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroceryList } from './entities/grocery-list.entity';
import { User } from 'src/user/user.entity';
import { UserInventory } from 'src/user-inventory/entities/user-inventory.entity';
import { UserInventoryService } from 'src/user-inventory/user-inventory.service';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class GroceryListService {
    constructor(
      private readonly userInventoryService: UserInventoryService,
        @InjectRepository(GroceryList)
        private groceryRepository: Repository<GroceryList>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserInventory)
        private readonly UserInventoryRepository: Repository<UserInventory>,

    ){}

  async create(id: number, dto: CreateGroceryListDto) {
    const pantryItems: UserInventory[] = await this.userInventoryService.findAll(id);
    for(const item of pantryItems){
      if(item.quantity < item.qPref){
      const list = this.groceryRepository.create({
        qToBuy: item.qPref - item.quantity,
        isPurchased: false,
        product: { product_id: dto.product_id },
        user: { user_id: dto.user_id }
       });
      return await this.groceryRepository.save(list);
    }
    }
  }

  async findOne(user_id: number) {
    return await this.groceryRepository.find({ relations: ['user', 'product'], where: { 
      user: { user_id: user_id }}});
  }

  async update(id: number, updateGroceryListDto: UpdateGroceryListDto) {
      await this.groceryRepository.update(id, updateGroceryListDto);
      return this.groceryRepository.findOneBy({ list_id: id });
  }

  async remove(id: number) {
      const result = await this.groceryRepository.delete(id)
      if(result.affected === 0){
          throw new NotFoundException;
      }
      return null;
  }
}

