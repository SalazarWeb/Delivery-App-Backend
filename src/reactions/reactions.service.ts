import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  async create(
    createReactionDto: CreateReactionDto,
    userId: string,
  ): Promise<Reaction> {
    // Verificar si ya existe una reacción del usuario en este producto
    const existingReaction = await this.reactionRepository.findOne({
      where: {
        userId,
        productId: createReactionDto.productId,
      },
    });

    // Si existe, actualizar el tipo de reacción
    if (existingReaction) {
      existingReaction.type = createReactionDto.type;
      return this.reactionRepository.save(existingReaction);
    }

    // Si no existe, crear una nueva
    const reaction = this.reactionRepository.create({
      ...createReactionDto,
      userId,
    });

    try {
      return await this.reactionRepository.save(reaction);
    } catch (error) {
      // Manejar error de constraint UNIQUE por si acaso
      if (error.code === '23505') {
        throw new ConflictException(
          'Ya existe una reacción de este usuario en este producto',
        );
      }
      throw error;
    }
  }

  async findByProduct(productId: string): Promise<Reaction[]> {
    return this.reactionRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Reaction[]> {
    return this.reactionRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, productId: string): Promise<Reaction | null> {
    return this.reactionRepository.findOne({
      where: { userId, productId },
      relations: ['user', 'product'],
    });
  }

  async remove(userId: string, productId: string): Promise<void> {
    const reaction = await this.reactionRepository.findOne({
      where: { userId, productId },
    });

    if (!reaction) {
      throw new NotFoundException('Reacción no encontrada');
    }

    await this.reactionRepository.remove(reaction);
  }

  async getReactionStats(productId: string): Promise<{
    total: number;
    likes: number;
    loves: number;
    dislikes: number;
  }> {
    const reactions = await this.reactionRepository.find({
      where: { productId },
    });

    return {
      total: reactions.length,
      likes: reactions.filter((r) => r.type === 'like').length,
      loves: reactions.filter((r) => r.type === 'love').length,
      dislikes: reactions.filter((r) => r.type === 'dislike').length,
    };
  }
}
