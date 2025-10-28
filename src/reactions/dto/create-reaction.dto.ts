import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ReactionType } from '../../entities/reaction.entity';

export class CreateReactionDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsEnum(ReactionType)
  @IsNotEmpty()
  type: ReactionType;
}
