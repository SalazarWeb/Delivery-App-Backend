import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BusinessesService } from '../businesses/businesses.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;
  let businessesService: BusinessesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockBusinessesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: BusinessesService,
          useValue: mockBusinessesService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    businessesService = module.get<BusinessesService>(BusinessesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto: CreateProductDto = {
        name: 'Pizza Margarita',
        description: 'Deliciosa pizza',
        weightGrams: 500,
        price: 8990,
        isAvailable: true,
      };

      const businessId = 'business-uuid';
      const userId = 'owner-uuid';

      const mockBusiness = {
        id: businessId,
        ownerId: userId,
      };

      const expectedProduct = {
        id: 'product-uuid',
        ...createDto,
        businessId,
        createdAt: new Date(),
      };

      mockBusinessesService.findOne.mockResolvedValue(mockBusiness);
      mockRepository.create.mockReturnValue(expectedProduct);
      mockRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.create(createDto, businessId, userId);

      expect(businessesService.findOne).toHaveBeenCalledWith(businessId);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        businessId,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedProduct);
    });

    it('should throw ForbiddenException if user is not the business owner', async () => {
      const createDto: CreateProductDto = {
        name: 'Pizza',
        price: 8990,
      };

      const businessId = 'business-uuid';
      const userId = 'other-user-uuid';

      const mockBusiness = {
        id: businessId,
        ownerId: 'owner-uuid', // Different from userId
      };

      mockBusinessesService.findOne.mockResolvedValue(mockBusiness);

      await expect(
        service.create(createDto, businessId, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const expectedProducts = [
        {
          id: 'product-1',
          name: 'Pizza',
          businessId: 'business-1',
        },
        {
          id: 'product-2',
          name: 'Hamburguesa',
          businessId: 'business-2',
        },
      ];

      mockRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['business'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(expectedProducts);
    });

    it('should return products filtered by businessId', async () => {
      const businessId = 'business-uuid';
      const expectedProducts = [
        {
          id: 'product-1',
          name: 'Pizza',
          businessId,
        },
      ];

      mockRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.findAll(businessId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { businessId },
        relations: ['business'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = 'product-uuid';
      const expectedProduct = {
        id: productId,
        name: 'Pizza',
        businessId: 'business-uuid',
      };

      mockRepository.findOne.mockResolvedValue(expectedProduct);

      const result = await service.findOne(productId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['business'],
      });
      expect(result).toEqual(expectedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = 'product-uuid';
      const userId = 'owner-uuid';
      const updateDto: UpdateProductDto = {
        name: 'Pizza Actualizada',
        price: 9990,
      };

      const existingProduct = {
        id: productId,
        name: 'Pizza',
        businessId: 'business-uuid',
        price: 8990,
      };

      const mockBusiness = {
        id: 'business-uuid',
        ownerId: userId,
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(existingProduct);
      mockBusinessesService.findOne.mockResolvedValue(mockBusiness);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(productId, updateDto, userId);

      expect(result.name).toBe('Pizza Actualizada');
      expect(result.price).toBe(9990);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the business owner', async () => {
      const productId = 'product-uuid';
      const userId = 'other-user-uuid';
      const updateDto: UpdateProductDto = {
        name: 'Pizza Actualizada',
      };

      const existingProduct = {
        id: productId,
        name: 'Pizza',
        businessId: 'business-uuid',
      };

      const mockBusiness = {
        id: 'business-uuid',
        ownerId: 'owner-uuid', // Different from userId
      };

      mockRepository.findOne.mockResolvedValue(existingProduct);
      mockBusinessesService.findOne.mockResolvedValue(mockBusiness);

      await expect(
        service.update(productId, updateDto, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = 'product-uuid';
      const userId = 'owner-uuid';

      const existingProduct = {
        id: productId,
        name: 'Pizza',
        businessId: 'business-uuid',
      };

      const mockBusiness = {
        id: 'business-uuid',
        ownerId: userId,
      };

      mockRepository.findOne.mockResolvedValue(existingProduct);
      mockBusinessesService.findOne.mockResolvedValue(mockBusiness);
      mockRepository.remove.mockResolvedValue(existingProduct);

      await service.remove(productId, userId);

      expect(repository.remove).toHaveBeenCalledWith(existingProduct);
    });

    it('should throw ForbiddenException if user is not the business owner', async () => {
      const productId = 'product-uuid';
      const userId = 'other-user-uuid';

      const existingProduct = {
        id: productId,
        name: 'Pizza',
        businessId: 'business-uuid',
      };

      const mockBusiness = {
        id: 'business-uuid',
        ownerId: 'owner-uuid', // Different from userId
      };

      mockRepository.findOne.mockResolvedValue(existingProduct);
      mockBusinessesService.findOne.mockResolvedValue(mockBusiness);

      await expect(service.remove(productId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findByBusiness', () => {
    it('should return products of a specific business', async () => {
      const businessId = 'business-uuid';
      const expectedProducts = [
        {
          id: 'product-1',
          name: 'Pizza',
          businessId,
        },
        {
          id: 'product-2',
          name: 'Hamburguesa',
          businessId,
        },
      ];

      mockRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.findByBusiness(businessId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { businessId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(expectedProducts);
    });
  });
});
