import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { Reaction, ReactionType } from '../entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';

describe('ReactionsService', () => {
  let service: ReactionsService;
  let repository: Repository<Reaction>;

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
        ReactionsService,
        {
          provide: getRepositoryToken(Reaction),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReactionsService>(ReactionsService);
    repository = module.get<Repository<Reaction>>(
      getRepositoryToken(Reaction),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reaction', async () => {
      const createDto: CreateReactionDto = {
        productId: 'product-uuid',
        type: ReactionType.LIKE,
      };

      const userId = 'user-uuid';
      const expectedReaction = {
        id: 'reaction-uuid',
        ...createDto,
        userId,
        createdAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null); // No existe reacción previa
      mockRepository.create.mockReturnValue(expectedReaction);
      mockRepository.save.mockResolvedValue(expectedReaction);

      const result = await service.create(createDto, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId, productId: createDto.productId },
      });
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        userId,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedReaction);
    });

    it('should update existing reaction', async () => {
      const createDto: CreateReactionDto = {
        productId: 'product-uuid',
        type: ReactionType.LOVE,
      };

      const userId = 'user-uuid';
      const existingReaction = {
        id: 'reaction-uuid',
        userId,
        productId: createDto.productId,
        type: ReactionType.LIKE,
        createdAt: new Date(),
      };

      const updatedReaction = {
        ...existingReaction,
        type: ReactionType.LOVE,
      };

      mockRepository.findOne.mockResolvedValue(existingReaction);
      mockRepository.save.mockResolvedValue(updatedReaction);

      const result = await service.create(createDto, userId);

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith({
        ...existingReaction,
        type: ReactionType.LOVE,
      });
      expect(result.type).toBe(ReactionType.LOVE);
    });

    it('should throw ConflictException on unique constraint violation', async () => {
      const createDto: CreateReactionDto = {
        productId: 'product-uuid',
        type: ReactionType.LIKE,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockRejectedValue({ code: '23505' }); // Unique violation

      await expect(service.create(createDto, 'user-uuid')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByProduct', () => {
    it('should return reactions for a product', async () => {
      const productId = 'product-uuid';
      const expectedReactions = [
        {
          id: 'reaction-1',
          userId: 'user-1',
          productId,
          type: ReactionType.LIKE,
        },
        {
          id: 'reaction-2',
          userId: 'user-2',
          productId,
          type: ReactionType.LOVE,
        },
      ];

      mockRepository.find.mockResolvedValue(expectedReactions);

      const result = await service.findByProduct(productId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { productId },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(expectedReactions);
    });
  });

  describe('findByUser', () => {
    it('should return reactions by a user', async () => {
      const userId = 'user-uuid';
      const expectedReactions = [
        {
          id: 'reaction-1',
          userId,
          productId: 'product-1',
          type: ReactionType.LIKE,
        },
        {
          id: 'reaction-2',
          userId,
          productId: 'product-2',
          type: ReactionType.LOVE,
        },
      ];

      mockRepository.find.mockResolvedValue(expectedReactions);

      const result = await service.findByUser(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(expectedReactions);
    });
  });

  describe('findOne', () => {
    it('should return a specific reaction', async () => {
      const userId = 'user-uuid';
      const productId = 'product-uuid';
      const expectedReaction = {
        id: 'reaction-uuid',
        userId,
        productId,
        type: ReactionType.LIKE,
      };

      mockRepository.findOne.mockResolvedValue(expectedReaction);

      const result = await service.findOne(userId, productId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId, productId },
        relations: ['user', 'product'],
      });
      expect(result).toEqual(expectedReaction);
    });
  });

  describe('remove', () => {
    it('should remove a reaction', async () => {
      const userId = 'user-uuid';
      const productId = 'product-uuid';
      const existingReaction = {
        id: 'reaction-uuid',
        userId,
        productId,
        type: ReactionType.LIKE,
      };

      mockRepository.findOne.mockResolvedValue(existingReaction);
      mockRepository.remove.mockResolvedValue(existingReaction);

      await service.remove(userId, productId);

      expect(repository.remove).toHaveBeenCalledWith(existingReaction);
    });

    it('should throw NotFoundException if reaction not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove('user-uuid', 'product-uuid'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getReactionStats', () => {
    it('should return reaction statistics', async () => {
      const productId = 'product-uuid';
      const reactions = [
        { type: ReactionType.LIKE },
        { type: ReactionType.LIKE },
        { type: ReactionType.LOVE },
        { type: ReactionType.DISLIKE },
      ];

      mockRepository.find.mockResolvedValue(reactions);

      const result = await service.getReactionStats(productId);

      expect(result).toEqual({
        total: 4,
        likes: 2,
        loves: 1,
        dislikes: 1,
      });
    });

    it('should return zero stats for product with no reactions', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getReactionStats('product-uuid');

      expect(result).toEqual({
        total: 0,
        likes: 0,
        loves: 0,
        dislikes: 0,
      });
    });
  });
});
