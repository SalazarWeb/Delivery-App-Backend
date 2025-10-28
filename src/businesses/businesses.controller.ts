import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessOwnerGuard } from './guards/business-owner.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Business } from '../entities/business.entity';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  /**
   * POST /businesses
   * Crea un nuevo negocio (requiere autenticación y ser empresa)
   */
  @Post()
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @CurrentUser() user: any,
  ): Promise<Business> {
    return this.businessesService.create(createBusinessDto, user.id);
  }

  /**
   * GET /businesses
   * Obtiene todos los negocios (público)
   */
  @Get()
  async findAll(): Promise<Business[]> {
    return this.businessesService.findAll();
  }

  /**
   * GET /businesses/:id
   * Obtiene un negocio por ID (público)
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Business> {
    return this.businessesService.findOne(id);
  }

  /**
   * PUT /businesses/:id
   * Actualiza un negocio (requiere autenticación y ser el propietario)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @CurrentUser() user: any,
  ): Promise<Business> {
    return this.businessesService.update(id, updateBusinessDto, user.id);
  }

  /**
   * DELETE /businesses/:id
   * Elimina un negocio (requiere autenticación y ser el propietario)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    return this.businessesService.remove(id, user.id);
  }

  /**
   * GET /businesses/owner/me
   * Obtiene los negocios del usuario autenticado
   */
  @Get('owner/me')
  @UseGuards(JwtAuthGuard, BusinessOwnerGuard)
  async getMyBusinesses(@CurrentUser() user: any): Promise<Business[]> {
    return this.businessesService.findByOwner(user.id);
  }
}
