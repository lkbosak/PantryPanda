import { Module } from '@nestjs/common';
import { UserInventoryService } from './user-inventory.service';
import { UserInventoryController } from './user-inventory.controller';

@Module({
  controllers: [UserInventoryController],
  providers: [UserInventoryService],
})
export class UserInventoryModule {}
