import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, UserType } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        type: UserType.CLIENTE,
        name: 'Test User',
        phone: '1234567890',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
      };

      const expectedUser = { id: 'uuid', ...createUserDto };

      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: 'uuid',
        type: UserType.CLIENTE,
        name: 'Test User',
        phone: '1234567890',
        email,
        passwordHash: 'hashedpassword',
      };

      mockRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(expectedUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const id = 'uuid';
      const expectedUser = {
        id,
        type: UserType.EMPRESA,
        name: 'Test Company',
        phone: '1234567890',
        email: 'company@example.com',
        passwordHash: 'hashedpassword',
      };

      mockRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(expectedUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('nonexistent-uuid');

      expect(result).toBeNull();
    });
  });
});
