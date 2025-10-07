import { Module } from '@nestjs/common';
import { GroceryListService } from './grocery-list.service';
import { GroceryListController } from './grocery-list.controller';
import { GroceryList } from './entities/grocery-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([GroceryList])],
    controllers: [GroceryListController],
    providers: [GroceryListService],
})
export class GroceryListModule {}
