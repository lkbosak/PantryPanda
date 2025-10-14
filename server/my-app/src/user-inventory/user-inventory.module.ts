import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInventoryService } from './user-inventory.service';
import { UserInventoryController } from './user-inventory.controller';
import { UserInventory } from './entities/user-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserInventory])],
  controllers: [UserInventoryController],
  providers: [UserInventoryService],
})
export class UserInventoryModule {}
