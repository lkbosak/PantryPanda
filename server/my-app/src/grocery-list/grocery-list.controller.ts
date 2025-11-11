import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroceryListService } from './grocery-list.service';
import { CreateGroceryListDto } from './dto/create-grocery-list.dto';
import { UpdateGroceryListDto } from './dto/update-grocery-list.dto';

@Controller('grocery-list')
export class GroceryListController {
  constructor(private readonly groceryListService: GroceryListService) {}

  @Post('generate/:user_id')
  generateFromPantry(@Param('user_id') user_id: number){
    return this.groceryListService.generateFromPantry(+user_id);
  }

  @Post()
  create(@Body() createGroceryListDto: CreateGroceryListDto) {
    return this.groceryListService.create(createGroceryListDto);
  }

  @Get(':user_id')
  findByUser(@Param('user_id') user_id: number){
    return this.groceryListService.findByUser(+user_id);
  }

  @Get(':list_id')
  findOne(@Param('list_id') list_id: number) {
    return this.groceryListService.findOne(+list_id);
  }

  @Patch(':list_id')
  update(@Param('list_id') id: number, @Body() updateGroceryListDto: UpdateGroceryListDto) {
    return this.groceryListService.update(+id, updateGroceryListDto);
  }

  @Delete(':list_id')
  remove(@Param('list_id') list_id: number) {
    return this.groceryListService.remove(+list_id);
  }
}
