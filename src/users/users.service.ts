import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario
   * @param createUserDto Datos del usuario a crear
   * @returns El usuario creado
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  /**
   * Busca un usuario por email
   * @param email Email del usuario
   * @returns El usuario encontrado o null
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Busca un usuario por ID
   * @param id UUID del usuario
   * @returns El usuario encontrado o null
   */
  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }
}
