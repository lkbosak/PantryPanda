import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroceryListService } from './grocery-list.service';
import { GroceryList } from './entities/grocery-list.entity';

describe('GroceryListService', () => {
  let service: GroceryListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroceryListService,
        { provide: getRepositoryToken(GroceryList), useValue: {} },
      ],
    }).compile();

    service = module.get<GroceryListService>(GroceryListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
