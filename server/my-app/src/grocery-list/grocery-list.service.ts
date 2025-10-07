import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroceryListDto } from './dto/create-grocery-list.dto';
import { UpdateGroceryListDto } from './dto/update-grocery-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroceryList } from './entities/grocery-list.entity';

@Injectable()
export class GroceryListService {
    constructor(
        @InjectRepository(GroceryList)
        private groceryRepository: Repository<GroceryList>,
    ){}

  async create(createGroceryListDto: CreateGroceryListDto) {
        return await this.groceryRepository.save(createGroceryListDto);
  }

  async findOne(id: number) {
    return await this.groceryRepository.findOneBy({list_id: id});
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

