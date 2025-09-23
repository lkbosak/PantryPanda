import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { async } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue({ user_id: 1, username: 'username' }),
            find: jest.fn().mockResolvedValue([{ user_id: 1, username: 'username' }]),
            findOneBy: jest.fn().mockResolvedValue({ user_id: 1, username: 'username' }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //create
  it('should create a new user', async () => {
    const dto = { username: 'username', password: 'password', email: 'email@gmail.com', accountCreated: new Date() };
    const result = await service.createUser(dto);
    expect(result).toEqual({ user_id: 1, username: 'username' });
    expect(repo.save).toHaveBeenCalledWith(dto);
  });

  //findoneby
  it('should find a user', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({ user_id: 1, username: 'username' });
    expect(repo.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
  });

  //update
  it('should update a user', async () =>{
      const dto = { username: 'newusername'};
      const result = await service.updateUser(1, dto);
      expect(result).toEqual({ user_id: 1, username: 'newusername'});
      expect(repo.update).toHaveBeenCalledWith(dto);
  });
  //remove
  it('should remove a user', async() => {
      await service.remove(1);
      const result = service.findOne(1);
      expect(result).toBeNull();
      expect(repo.remove).toHaveBeenCalledWith(1);


  });

});

