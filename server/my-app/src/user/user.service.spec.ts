import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { async } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;
  const mockUser: CreateUserDto = {
      username: 'username',
      email: 'email@gmail.com',
      password: 'password',
      accountCreated: new Date()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockReturnValue(mockUser),
            findOneBy: jest.fn().mockReturnValue(mockUser),
            update: jest.fn().mockReturnValue(mockUser),
            delete: jest.fn().mockReturnValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //create
  it('should create a new user', async () => {
    const dto = { username: 'username', password: 'password', email: 'email@gmail.com', accountCreated: new Date() };
    const result = await service.createUser(dto);
    expect(result).toEqual(mockUser);
    expect(repo.save).toHaveBeenCalledWith(dto);
  });

  //findoneby
  it('should find a user', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockUser);
    expect(repo.findOneBy).toHaveBeenCalledWith({user_id: 1 });
  });

  //update
  it('should update a user', async () =>{
      repo.update.mockResolvedValue({affected: 1} as any)
      repo.findOneBy.mockResolvedValue(mockUser as any)
      const dto = {username: 'newusername'}
      const result = await service.updateUser(1, dto);
      expect(result).toEqual(mockUser);
      expect(repo.update).toHaveBeenCalledWith(1, dto);
      expect(repo.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
  });
  //remove
  it('should remove a user', async() => {
      const result = await service.remove(1);
      expect(result).toBeNull();
      expect(repo.delete).toHaveBeenCalledWith(1);
  });

});

