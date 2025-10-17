import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserInventoryController } from './user-inventory.controller';
import { UserInventoryService } from './user-inventory.service';
import { UserInventory } from './entities/user-inventory.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/entities/product.entity';

describe('UserInventoryController', () => {
  let controller: UserInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInventoryController],
      providers: [
        UserInventoryService,
  { provide: getRepositoryToken(UserInventory), useValue: {} },
  { provide: getRepositoryToken(User), useValue: {} },
  { provide: getRepositoryToken(Product), useValue: {} },
      ],
    }).compile();

    controller = module.get<UserInventoryController>(UserInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
