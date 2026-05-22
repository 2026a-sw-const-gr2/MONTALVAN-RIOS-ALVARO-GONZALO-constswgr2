import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInstrumentDto {
  @IsString()
  nombre: string;

  @IsString()
  tipo: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  condicion?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;
}
