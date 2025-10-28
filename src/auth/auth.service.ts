import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, JwtPayload } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario
   * @param registerDto Datos del usuario a registrar
   * @returns Token de acceso y datos del usuario
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Verificar si el email ya existe
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // Crear el usuario
    const user = await this.usersService.create({
      type: registerDto.type,
      name: registerDto.name,
      phone: registerDto.phone,
      email: registerDto.email,
      passwordHash,
    });

    // Generar token JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: user.type,
    };

    const access_token = await this.jwtService.signAsync(payload);

    // Retornar respuesta
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Inicia sesión con email y contraseña
   * @param loginDto Credenciales de login
   * @returns Token de acceso y datos del usuario
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Buscar usuario por email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: user.type,
    };

    const access_token = await this.jwtService.signAsync(payload);

    // Retornar respuesta
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Valida un token JWT y retorna el payload
   * @param token Token JWT
   * @returns Payload del token
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
