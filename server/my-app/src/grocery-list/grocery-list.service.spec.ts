import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { GroceryListService } from './grocery-list.service';
import { CreateGroceryListDto } from './dto/create-grocery-list.dto';
import { UpdateGroceryListDto } from './dto/update-grocery-list.dto';
import { GroceryList } from './entities/grocery-list.entity';
import { User } from 'src/user/user.entity';
import { UserInventory } from 'src/user-inventory/entities/user-inventory.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserInventoryService } from 'src/user-inventory/user-inventory.service';

describe('GroceryListService', () => {
  let service: GroceryListService;
  let groceryRepository: jest.Mocked<Repository<GroceryList>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let userInventoryRepository: jest.Mocked<Repository<UserInventory>>;
  let productRepository: jest.Mocked<Repository<Product>>;
  let userInventoryService: jest.Mocked<UserInventoryService>;

  const mockUser: User = {
    user_id: 1,
    username: 'John Doe',
    email: 'john@example.com',
    password: 'password',
    accountCreated: new Date(),
    inventoryItems:[]
  };

  const mockProduct: Product = {
    product_id: 1,
    product_name: 'Whole Milk',
    barcode_upc: '123456789012',
    description: 'Fresh whole milk 1 gallon',
    groceryList: [],
    inventoryEntries: [], 
  };



  const mockGroceryList: GroceryList = {
    list_id: 1,
    qToBuy: 2,
    isPurchased: false,
    product: mockProduct,
    user: mockUser,
  };

  const mockUserInventory: UserInventory = {
    inventory_id: 1,
    quantity: 1,
    unit: 'gallons',
    expiration_date: new Date('2024-12-01'),
    date_added: new Date('2024-11-01'),
    location: 'fridge',
    qPref: 5,
    user: mockUser,
    product: mockProduct,  };

  beforeEach(async () => {
    const mockUserInventoryService = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroceryListService,
        {
          provide: getRepositoryToken(GroceryList),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserInventory),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: UserInventoryService,
          useValue: mockUserInventoryService,
        },
      ],
    }).compile();

    service = module.get<GroceryListService>(GroceryListService);
    groceryRepository = module.get(getRepositoryToken(GroceryList));
    userRepository = module.get(getRepositoryToken(User));
    userInventoryRepository = module.get(getRepositoryToken(UserInventory));
    productRepository = module.get(getRepositoryToken(Product));
    userInventoryService = module.get(UserInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateGroceryListDto = {
      user_id: 1,
      product_id: 123,
      isPurchased: false,
      qToBuy: 2,
    };

    it('should create a grocery list item successfully', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      productRepository.findOneBy.mockResolvedValue(mockProduct);
      groceryRepository.findOne.mockResolvedValue(null); // No existing item
      groceryRepository.create.mockReturnValue(mockGroceryList);
      groceryRepository.save.mockResolvedValue(mockGroceryList);
      userInventoryRepository.findOne.mockResolvedValue(mockUserInventory);

      const result = await service.create(createDto);

      expect(result).toEqual(mockGroceryList);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ product_id: 123 });
      expect(groceryRepository.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      productRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if item already exists in grocery list', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      productRepository.findOneBy.mockResolvedValue(mockProduct);
      groceryRepository.findOne.mockResolvedValue(mockGroceryList);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if inventory quantity is already at preference level', async () => {
      const highStockInventory = { ...mockUserInventory, quantity: 10, qPref: 5 };
      
      userRepository.findOneBy.mockResolvedValue(mockUser);
      productRepository.findOneBy.mockResolvedValue(mockProduct);
      groceryRepository.findOne.mockResolvedValue(null);
      userInventoryRepository.findOne.mockResolvedValue(highStockInventory);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateFromPantry', () => {
    it('should generate grocery list items for low-stock pantry items', async () => {
      const userId = 1;
      const mockLowStockItem = {
        ...mockUserInventory,
        quantity: 1,
        qPref: 4,
        product: { ...mockProduct, product_id: 456 }
      };

      const expectedGroceryList = {
        ...mockGroceryList,
        list_id: 999,
        qToBuy: 3, 
        product: { ...mockProduct, product_id: 456 }
      };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      userInventoryService.findAll.mockResolvedValue([mockLowStockItem]);
      groceryRepository.findOne.mockResolvedValue(null); // No existing items
      groceryRepository.create.mockReturnValue(expectedGroceryList);
      groceryRepository.save.mockResolvedValue(expectedGroceryList);

      const result = await service.generateFromPantry(userId);

      expect(result).toHaveLength(1);
      expect(result[0].qToBuy).toBe(3);
      expect(groceryRepository.create).toHaveBeenCalled();
    });

    it('should skip items already in grocery list', async () => {
      const userId = 1;
      const mockLowStockItem = {
        ...mockUserInventory,
        quantity: 2,
        qPref: 5,
        product: { ...mockProduct, product_id: 456 }
      };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      userInventoryService.findAll.mockResolvedValue([mockLowStockItem]);
      groceryRepository.findOne.mockResolvedValue(mockGroceryList); // Existing item

      const result = await service.generateFromPantry(userId);

      expect(result).toHaveLength(0);
      expect(groceryRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.generateFromPantry(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return unpurchased grocery list items for a user', async () => {
      const userId = 1;
      const mockUnpurchasedItems = [
        { ...mockGroceryList, list_id: 1 },
        { ...mockGroceryList, list_id: 2, isPurchased: false }
      ];

      userRepository.findOneBy.mockResolvedValue(mockUser);
      groceryRepository.find.mockResolvedValue(mockUnpurchasedItems);

      const result = await service.findByUser(userId);

      expect(result).toEqual(mockUnpurchasedItems);
      expect(groceryRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'product'],
        where: { user: { user_id: userId }, isPurchased: false },
        order: { list_id: 'DESC' },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findByUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single grocery list item by ID', async () => {
      const listId = 1;
      groceryRepository.findOne.mockResolvedValue(mockGroceryList);

      const result = await service.findOne(listId);

      expect(result).toEqual(mockGroceryList);
      expect(groceryRepository.findOne).toHaveBeenCalledWith({
        relations: ['user', 'product'],
        where: { list_id: listId },
      });
    });

    it('should throw NotFoundException if item does not exist', async () => {
      groceryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a grocery list item successfully', async () => {
      const listId = 1;
      const updateDto: UpdateGroceryListDto = {
        qToBuy: 5,
        isPurchased: true,
      };
      const updatedItem = { ...mockGroceryList, ...updateDto };

      groceryRepository.findOneBy.mockResolvedValue(mockGroceryList);
      groceryRepository.update.mockResolvedValue({ affected: 1 } as any);
      groceryRepository.findOne.mockResolvedValue(updatedItem);

      const result = await service.update(listId, updateDto);

      expect(result).toEqual(updatedItem);
      expect(groceryRepository.update).toHaveBeenCalledWith(listId, updateDto);
    });

    it('should throw NotFoundException if item does not exist', async () => {
      groceryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { qToBuy: 5 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a grocery list item successfully', async () => {
      const listId = 1;
      groceryRepository.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(listId);

      expect(result).toBeNull();
      expect(groceryRepository.delete).toHaveBeenCalledWith(listId);
    });

    it('should throw NotFoundException if item does not exist', async () => {
      groceryRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});

