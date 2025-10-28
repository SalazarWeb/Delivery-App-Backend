import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createReactionDto: CreateReactionDto,
    @CurrentUser() user: User,
  ) {
    return this.reactionsService.create(createReactionDto, user.id);
  }

  @Get()
  findByProduct(@Query('productId') productId: string) {
    if (productId) {
      return this.reactionsService.findByProduct(productId);
    }
    return [];
  }

  @Get('my-reactions')
  @UseGuards(JwtAuthGuard)
  findMyReactions(@CurrentUser() user: User) {
    return this.reactionsService.findByUser(user.id);
  }

  @Get('stats')
  getStats(@Query('productId') productId: string) {
    return this.reactionsService.getReactionStats(productId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove(
    @Query('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    return this.reactionsService.remove(user.id, productId);
  }
}
