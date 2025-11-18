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
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class GroceryListService {
    constructor(
      private readonly userInventoryService: UserInventoryService,
        @InjectRepository(GroceryList)
        private groceryRepository: Repository<GroceryList>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserInventory)
        private readonly userInventoryRepository: Repository<UserInventory>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>

    ){}

  //creates the entry in the db manually by user
  async create(dto: CreateGroceryListDto) {
    // Verify user exists
        const user = await this.userRepository.findOneBy({ user_id: dto.user_id });
        if (!user) {
            throw new NotFoundException(`User with ID ${dto.user_id} not found`);
        }

        // Verify product exists
        const product = await this.productRepository.findOneBy({ product_id: dto.product_id });
        if (!product) {
            throw new NotFoundException(`Product with ID ${dto.product_id} not found`);
        }

        // Check if item already exists in grocery list (not purchased)
        const existingItem = await this.groceryRepository.findOne({
            where: {
                user: { user_id: dto.user_id },
                product: { product_id: dto.product_id },
                isPurchased: false
            }
        });

        if (existingItem) {
            throw new BadRequestException('This product is already in your grocery list');
        }

        // Find the user's inventory for this product
        const inventoryItem = await this.userInventoryRepository.findOne({
            where: {
                user: { user_id: dto.user_id },
                product: { product_id: dto.product_id }
            }
        });

        let qToBuy: number;

        if (inventoryItem) {
            // Calculate quantity to buy based on preference
            if (inventoryItem.quantity < inventoryItem.qPref) {
                qToBuy = inventoryItem.qPref - inventoryItem.quantity;
            } else {
                throw new BadRequestException('Product quantity is already at or above preference level');
            }
        } else {
            // If not in inventory, use a default quantity or require it in the DTO
            qToBuy = dto.qToBuy || 1;
        }

        // Create grocery list entry using actual entities (avoid relying on partial relation objects)
        const groceryItem = this.groceryRepository.create({
            qToBuy: qToBuy,
            isPurchased: false,
            product: product,
            user: user,
        });

        return await this.groceryRepository.save(groceryItem);
    }

    //this is the logic that creates an entry based on quantity and preference
    //This is what auto generates the list
    async generateFromPantry(user_id: number) {
      console.log(user_id)
        const user = await this.userRepository.findOneBy({ user_id });
        if (!user) {
            throw new NotFoundException(`User with ID ${user_id} not found`);
        }

        const pantryItems: UserInventory[] = await this.userInventoryService.findAll(user_id);
        const createdItems: GroceryList[] = [];

        for (const item of pantryItems) {
            if (item.quantity < item.qPref) {
                //Check if already in grocery list
                const existingItem = await this.groceryRepository.findOne({
                    where: {
                        user: { user_id: user_id },
                        product: { product_id: item.product.product_id },
                        isPurchased: false
                    }
                });

                if (!existingItem) {
                    // use actual entities to ensure join columns are set
                    const groceryItem = this.groceryRepository.create({
                        qToBuy: item.qPref - item.quantity,
                        isPurchased: false,
                        product: item.product,
                        user: user,
                    });
                    const saved = await this.groceryRepository.save(groceryItem);
                    createdItems.push(saved);
                }
            }
        }

        return createdItems;
    }

  //find all items for user that are not marked as purchased
  //this can display the list for user
  async findByUser(user_id: number) {
      const user = await this.userRepository.findOneBy({ user_id });
      if (!user) {
          throw new NotFoundException(`User with ID ${user_id} not found`);
      }

      return await this.groceryRepository.find({
          relations: ['user', 'product'],
          where: { user: { user_id: user_id } ,
          isPurchased: false
          },
          order: { list_id: 'DESC' }
      });
  }

  //find a specific item for a user
  async findOne(list_id: number) {
    const item = await this.groceryRepository.findOne({
            relations: ['user', 'product'],
            where: { list_id }
        });
        if (!item) {
            throw new NotFoundException(`Grocery list item with ID ${list_id} not found`);
        }
        return item;
  }

  //update an entry(qToBuy, isPurchased)
  //whenever a user buys items, update that entry setting isPurchased true
  async update(list_id: number, updateGroceryListDto: UpdateGroceryListDto) {
      const item = await this.groceryRepository.findOneBy({ list_id: list_id });
        if (!item) {
            throw new NotFoundException(`Grocery list item with ID ${list_id} not found`);
        }
        await this.groceryRepository.update(list_id, updateGroceryListDto);
        return this.groceryRepository.findOne({
            relations: ['user', 'product'],
            where: { list_id: list_id }
        });
  }

  //remove item from db
  async remove(list_id: number) {
      const result = await this.groceryRepository.delete(list_id);
        if (result.affected === 0) {
            throw new NotFoundException(`Grocery list item with ID ${list_id} not found`);
        }
        return null;  
  }
}

