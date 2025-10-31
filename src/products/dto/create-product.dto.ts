import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsUrl,
  IsBoolean,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres' })
  name: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(1000, { message: 'La descripción no puede exceder los 1000 caracteres' })
  description?: string;

  @IsNumber({}, { message: 'El peso debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'El peso debe ser al menos 1 gramo' })
  weightGrams?: number;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsOptional()
  @Min(1, { message: 'La cantidad mínima es 1 unidad' })
  quantityUnits?: number;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  @Min(0.01, { message: 'El precio debe ser al menos 0.01' })
  price: number;

  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  @IsOptional()
  @MaxLength(500, { message: 'La URL de la imagen no puede exceder los 500 caracteres' })
  imageUrl?: string;

  @IsBoolean({ message: 'El campo disponible debe ser verdadero o falso' })
  @IsOptional()
  isAvailable?: boolean;
}
