import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroceryListController } from './grocery-list.controller';
import { GroceryListService } from './grocery-list.service';
import { GroceryList } from './entities/grocery-list.entity';

describe('GroceryListController', () => {
  let controller: GroceryListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroceryListController],
      providers: [
        GroceryListService,
        { provide: getRepositoryToken(GroceryList), useValue: {} },
      ],
    }).compile();

    controller = module.get<GroceryListController>(GroceryListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
