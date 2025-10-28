/**
 * EJEMPLO DE USO DEL MÓDULO USERS
 * 
 * Este archivo muestra cómo usar el UsersService en diferentes escenarios.
 * NO ejecutar este archivo directamente, es solo para referencia.
 */

import { UsersService } from './users.service';
import { UserType } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

// Ejemplo 1: Crear un usuario cliente
async function crearCliente(usersService: UsersService) {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const cliente = await usersService.create({
    type: UserType.CLIENTE,
    name: 'Juan Pérez',
    phone: '+56912345678',
    email: 'juan@example.com',
    passwordHash,
  });
  
  console.log('Cliente creado:', cliente);
  return cliente;
}

// Ejemplo 2: Crear un usuario empresa
async function crearEmpresa(usersService: UsersService) {
  const passwordHash = await bcrypt.hash('empresa123', 10);
  
  const empresa = await usersService.create({
    type: UserType.EMPRESA,
    name: 'Restaurante El Buen Sabor',
    phone: '+56987654321',
    email: 'restaurante@example.com',
    passwordHash,
  });
  
  console.log('Empresa creada:', empresa);
  return empresa;
}

// Ejemplo 3: Buscar usuario por email
async function buscarPorEmail(usersService: UsersService, email: string) {
  const user = await usersService.findByEmail(email);
  
  if (user) {
    console.log('Usuario encontrado:', user.name);
    console.log('Tipo:', user.type);
  } else {
    console.log('Usuario no encontrado');
  }
  
  return user;
}

// Ejemplo 4: Buscar usuario por ID
async function buscarPorId(usersService: UsersService, id: string) {
  const user = await usersService.findById(id);
  
  if (user) {
    console.log('Usuario encontrado:', user.name);
    console.log('Email:', user.email);
    console.log('Creado:', user.createdAt);
  } else {
    console.log('Usuario no encontrado');
  }
  
  return user;
}

// Ejemplo 5: Verificar si un email ya existe antes de crear
async function registrarUsuario(usersService: UsersService, email: string, password: string, name: string, phone: string) {
  // Verificar si el email ya está registrado
  const existingUser = await usersService.findByEmail(email);
  
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }
  
  // Crear el nuevo usuario
  const passwordHash = await bcrypt.hash(password, 10);
  
  const newUser = await usersService.create({
    type: UserType.CLIENTE,
    name,
    phone,
    email,
    passwordHash,
  });
  
  console.log('Usuario registrado exitosamente:', newUser.email);
  return newUser;
}

// Ejemplo 6: Verificar credenciales de login
async function verificarLogin(usersService: UsersService, email: string, password: string) {
  const user = await usersService.findByEmail(email);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }
  
  console.log('Login exitoso para:', user.email);
  return user;
}

export {
  crearCliente,
  crearEmpresa,
  buscarPorEmail,
  buscarPorId,
  registrarUsuario,
  verificarLogin,
};
