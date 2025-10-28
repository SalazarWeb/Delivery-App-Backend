import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BusinessesService } from '../businesses/businesses.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly businessesService: BusinessesService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    businessId: string,
    userId: string,
  ): Promise<Product> {
    // Verificar que el negocio existe y pertenece al usuario
    const business = await this.businessesService.findOne(businessId);
    if (business.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para crear productos en este negocio',
      );
    }

    const product = this.productRepository.create({
      ...createProductDto,
      businessId,
    });

    return this.productRepository.save(product);
  }

  async findAll(businessId?: string): Promise<Product[]> {
    const where = businessId ? { businessId } : {};
    return this.productRepository.find({
      where,
      relations: ['business'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Verificar que el usuario es el dueño del negocio
    const business = await this.businessesService.findOne(product.businessId);
    if (business.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este producto',
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string, userId: string): Promise<void> {
    const product = await this.findOne(id);

    // Verificar que el usuario es el dueño del negocio
    const business = await this.businessesService.findOne(product.businessId);
    if (business.ownerId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este producto',
      );
    }

    await this.productRepository.remove(product);
  }

  async findByBusiness(businessId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { businessId },
      order: { createdAt: 'DESC' },
    });
  }
}
