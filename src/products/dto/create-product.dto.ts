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
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  weightGrams?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  quantityUnits?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
