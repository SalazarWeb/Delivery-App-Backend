import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  DISLIKE = 'dislike',
}

@Entity('reactions')
@Unique(['userId', 'productId']) // Un usuario solo puede tener una reacción por producto
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({
    type: 'enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
