import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from '../entities/business.entity';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  /**
   * Crea un nuevo negocio
   * @param createBusinessDto Datos del negocio
   * @param ownerId ID del propietario (empresa)
   * @returns El negocio creado
   */
  async create(createBusinessDto: CreateBusinessDto, ownerId: string): Promise<Business> {
    const business = this.businessRepository.create({
      ...createBusinessDto,
      ownerId,
    });
    return await this.businessRepository.save(business);
  }

  /**
   * Obtiene todos los negocios
   * @returns Lista de negocios
   */
  async findAll(): Promise<Business[]> {
    return await this.businessRepository.find({
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene un negocio por ID
   * @param id ID del negocio
   * @returns El negocio encontrado
   */
  async findOne(id: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!business) {
      throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
    }

    return business;
  }

  /**
   * Actualiza un negocio
   * @param id ID del negocio
   * @param updateBusinessDto Datos a actualizar
   * @param userId ID del usuario que actualiza
   * @returns El negocio actualizado
   */
  async update(id: string, updateBusinessDto: UpdateBusinessDto, userId: string): Promise<Business> {
    const business = await this.findOne(id);

    // Verificar que el usuario sea el propietario
    if (business.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para actualizar este negocio');
    }

    Object.assign(business, updateBusinessDto);
    return await this.businessRepository.save(business);
  }

  /**
   * Elimina un negocio
   * @param id ID del negocio
   * @param userId ID del usuario que elimina
   */
  async remove(id: string, userId: string): Promise<void> {
    const business = await this.findOne(id);

    // Verificar que el usuario sea el propietario
    if (business.ownerId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este negocio');
    }

    await this.businessRepository.remove(business);
  }

  /**
   * Obtiene los negocios de un propietario
   * @param ownerId ID del propietario
   * @returns Lista de negocios del propietario
   */
  async findByOwner(ownerId: string): Promise<Business[]> {
    return await this.businessRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }
}
