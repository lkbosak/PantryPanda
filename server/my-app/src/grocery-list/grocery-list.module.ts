import { Module } from '@nestjs/common';
import { GroceryListService } from './grocery-list.service';
import { GroceryListController } from './grocery-list.controller';
import { GroceryList } from './entities/grocery-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserInventory } from 'src/user-inventory/entities/user-inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserInventoryModule } from 'src/user-inventory/user-inventory.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([GroceryList, User, UserInventory, Product]),
        UserInventoryModule,
    ],
    controllers: [GroceryListController],
    providers: [GroceryListService],
})
export class GroceryListModule {}
