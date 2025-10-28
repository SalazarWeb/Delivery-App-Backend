import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { Business } from '../entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

describe('BusinessesService', () => {
  let service: BusinessesService;
  let repository: Repository<Business>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessesService,
        {
          provide: getRepositoryToken(Business),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
    repository = module.get<Repository<Business>>(getRepositoryToken(Business));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new business', async () => {
      const createDto: CreateBusinessDto = {
        name: 'Test Restaurant',
        description: 'A test restaurant',
        address: '123 Test St',
        whatsappNumber: '+56987654321',
        openingHours: {
          lunes: { open: '09:00', close: '18:00' },
        },
      };

      const ownerId = 'owner-uuid';
      const expectedBusiness = {
        id: 'business-uuid',
        ...createDto,
        ownerId,
        createdAt: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedBusiness);
      mockRepository.save.mockResolvedValue(expectedBusiness);

      const result = await service.create(createDto, ownerId);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        ownerId,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedBusiness);
    });
  });

  describe('findAll', () => {
    it('should return an array of businesses', async () => {
      const expectedBusinesses = [
        {
          id: 'business-1',
          name: 'Restaurant 1',
          ownerId: 'owner-1',
        },
        {
          id: 'business-2',
          name: 'Restaurant 2',
          ownerId: 'owner-2',
        },
      ];

      mockRepository.find.mockResolvedValue(expectedBusinesses);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['owner'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(expectedBusinesses);
    });
  });

  describe('findOne', () => {
    it('should return a business by id', async () => {
      const businessId = 'business-uuid';
      const expectedBusiness = {
        id: businessId,
        name: 'Test Restaurant',
        ownerId: 'owner-uuid',
      };

      mockRepository.findOne.mockResolvedValue(expectedBusiness);

      const result = await service.findOne(businessId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: businessId },
        relations: ['owner'],
      });
      expect(result).toEqual(expectedBusiness);
    });

    it('should throw NotFoundException if business not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a business', async () => {
      const businessId = 'business-uuid';
      const userId = 'owner-uuid';
      const updateDto: UpdateBusinessDto = {
        name: 'Updated Restaurant',
      };

      const existingBusiness = {
        id: businessId,
        name: 'Old Restaurant',
        ownerId: userId,
      };

      const updatedBusiness = {
        ...existingBusiness,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(existingBusiness);
      mockRepository.save.mockResolvedValue(updatedBusiness);

      const result = await service.update(businessId, updateDto, userId);

      expect(result.name).toBe('Updated Restaurant');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const businessId = 'business-uuid';
      const userId = 'other-user-uuid';
      const updateDto: UpdateBusinessDto = {
        name: 'Updated Restaurant',
      };

      const existingBusiness = {
        id: businessId,
        name: 'Restaurant',
        ownerId: 'owner-uuid', // Different from userId
      };

      mockRepository.findOne.mockResolvedValue(existingBusiness);

      await expect(
        service.update(businessId, updateDto, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a business', async () => {
      const businessId = 'business-uuid';
      const userId = 'owner-uuid';

      const existingBusiness = {
        id: businessId,
        name: 'Restaurant',
        ownerId: userId,
      };

      mockRepository.findOne.mockResolvedValue(existingBusiness);
      mockRepository.remove.mockResolvedValue(existingBusiness);

      await service.remove(businessId, userId);

      expect(repository.remove).toHaveBeenCalledWith(existingBusiness);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const businessId = 'business-uuid';
      const userId = 'other-user-uuid';

      const existingBusiness = {
        id: businessId,
        name: 'Restaurant',
        ownerId: 'owner-uuid', // Different from userId
      };

      mockRepository.findOne.mockResolvedValue(existingBusiness);

      await expect(service.remove(businessId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findByOwner', () => {
    it('should return businesses of a specific owner', async () => {
      const ownerId = 'owner-uuid';
      const expectedBusinesses = [
        {
          id: 'business-1',
          name: 'Restaurant 1',
          ownerId,
        },
        {
          id: 'business-2',
          name: 'Restaurant 2',
          ownerId,
        },
      ];

      mockRepository.find.mockResolvedValue(expectedBusinesses);

      const result = await service.findByOwner(ownerId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { ownerId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(expectedBusinesses);
    });
  });
});
