import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroceryListService } from './grocery-list.service';
import { CreateGroceryListDto } from './dto/create-grocery-list.dto';
import { UpdateGroceryListDto } from './dto/update-grocery-list.dto';

@Controller('grocery-list')
export class GroceryListController {
  constructor(private readonly groceryListService: GroceryListService) {}

  @Post()
  create(@Param('id') id: number, @Body() createGroceryListDto: CreateGroceryListDto) {
    return this.groceryListService.create(id, createGroceryListDto);
  }

  @Get(':id')
  findOne(@Param('id') user_id: number) {
    return this.groceryListService.findOne(+user_id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateGroceryListDto: UpdateGroceryListDto) {
    return this.groceryListService.update(+id, updateGroceryListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groceryListService.remove(+id);
  }
}
