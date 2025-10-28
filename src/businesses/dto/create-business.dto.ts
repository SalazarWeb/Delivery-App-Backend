import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateBusinessDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'La dirección debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección es requerida' })
  address: string;

  @IsString({ message: 'El número de WhatsApp debe ser un texto' })
  @IsNotEmpty({ message: 'El número de WhatsApp es requerido' })
  whatsappNumber: string;

  @IsObject({ message: 'El horario debe ser un objeto' })
  @IsOptional()
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
}
