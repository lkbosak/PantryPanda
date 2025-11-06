import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInventoryDto } from './dto/create-user-inventory.dto';
import { UpdateUserInventoryDto } from './dto/update-user-inventory.dto';
import { Repository } from 'typeorm';
import { UserInventory } from './entities/user-inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class UserInventoryService {
    constructor(
        @InjectRepository(UserInventory)
        private readonly inventoryRepository: Repository<UserInventory>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    // Return all inventory entries. Include related user and product for convenience.
    async findAll(user_id: number) {
        return await this.inventoryRepository.find({ relations: ['user', 'product'], 
        where: {user: { user_id: user_id }}});
    }

async create(dto: CreateUserInventoryDto) {
    const user = await this.userRepository.findOneBy({ user_id: dto.user_id });
    const product = await this.productRepository.findOneBy({ product_id: dto.product_id });

    // Check if an entry for this user/product/location exists
    let inventory = await this.inventoryRepository.findOne({
        where: {
            user: { user_id: dto.user_id },
            product: { product_id: dto.product_id },
            location: dto.location
        },
        relations: ['user', 'product']
    });

    if (inventory) {
        // Update existing quantity / fields
        inventory.quantity += dto.quantity; 
        inventory.qPref = dto.qPref;
        inventory.expiration_date = dto.expiration_date;
        return this.inventoryRepository.save(inventory);
    }

    // Create new entry if it doesn't exist
    inventory = this.inventoryRepository.create({
        quantity: Number(dto.quantity),
        unit: dto.unit,
        expiration_date: new Date(dto.expiration_date),
        date_added: new Date(dto.date_added),
        location: dto.location as 'pantry' | 'fridge' | 'freezer' | 'spice rack',
        qPref: Number(dto.qPref),
        user: { user_id: dto.user_id },        // pass only the foreign key
        product: { product_id: dto.product_id }     });

        return this.inventoryRepository.save(inventory);
}



async findPantry(user_id: number){
    return await this.inventoryRepository.find({ relations: ['user', 'product'], 
      where:  { user: {user_id: user_id}, location: 'pantry'}});
}
async findFridge(user_id: number){
    return await this.inventoryRepository.find({ relations: ['user', 'product'], where:  { user: {user_id: user_id}, location: 'fridge'}});

}
async findFreezer(user_id: number){
    return await this.inventoryRepository.find({ relations: ['user', 'product'], where:  { user: {user_id: user_id}, location: 'freezer'}});

}
async findSpiceRack(user_id: number){
    return await this.inventoryRepository.find({ relations: ['user', 'product'], where:  { user: {user_id: user_id}, location: 'spice rack'}});

}

async findOne(user_id: number){
  return await this.inventoryRepository.find({relations: ['user', 'product'], where: {user: {user_id: user_id}}});
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

