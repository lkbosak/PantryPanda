import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserInventoryService } from './user-inventory.service';
import { CreateUserInventoryDto } from './dto/create-user-inventory.dto';
import { UpdateUserInventoryDto } from './dto/update-user-inventory.dto';

@Controller('user-inventory')
export class UserInventoryController {
  constructor(private readonly userInventoryService: UserInventoryService) {}

  @Post()
  create(@Body() createUserInventoryDto: CreateUserInventoryDto) {
    return this.userInventoryService.create(createUserInventoryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userInventoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserInventoryDto: UpdateUserInventoryDto) {
    return this.userInventoryService.update(+id, updateUserInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userInventoryService.remove(+id);
  }
}
