import { Module } from '@nestjs/common';
import { GroceryListService } from './grocery-list.service';
import { GroceryListController } from './grocery-list.controller';
import { GroceryList } from './entities/grocery-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInventory } from 'src/user-inventory/entities/user-inventory.entity';
import { UserInventoryService } from 'src/user-inventory/user-inventory.service';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GroceryList,
    User,
    UserInventory,
    Product,
    ])],
    controllers: [GroceryListController],
    providers: [GroceryListService, UserInventoryService],
})
export class GroceryListModule {}
