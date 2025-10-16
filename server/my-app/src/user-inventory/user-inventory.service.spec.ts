import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserInventoryService } from './user-inventory.service';
import { UserInventory } from './entities/user-inventory.entity';

describe('UserInventoryService', () => {
  let service: UserInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserInventoryService,
        { provide: getRepositoryToken(UserInventory), useValue: {} },
      ],
    }).compile();

    service = module.get<UserInventoryService>(UserInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
