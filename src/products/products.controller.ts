import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from '../businesses/guards/business-owner.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('businessId') businessId?: string) {
    return this.productsService.findAll(businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    @Query('businessId') businessId: string,
    @CurrentUser() user: User,
  ) {
    return this.productsService.create(createProductDto, businessId, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productsService.remove(id, user.id);
  }
}
