import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInventoryService } from './user-inventory.service';
import { UserInventoryController } from './user-inventory.controller';
import { UserInventory } from './entities/user-inventory.entity';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { GroceryList } from 'src/grocery-list/entities/grocery-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserInventory, User, Product, GroceryList])],
  controllers: [UserInventoryController],
  providers: [UserInventoryService],
  exports: [UserInventoryService],
})
export class UserInventoryModule {}
