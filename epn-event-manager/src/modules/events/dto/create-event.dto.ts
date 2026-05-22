import { IsString, IsNotEmpty, IsOptional, MaxLength, IsIn } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo source no puede estar vacío' })
  @MaxLength(100, { message: 'source no puede superar 100 caracteres' })
  source!: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo entity no puede estar vacío' })
  @MaxLength(100)
  entity!: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo action no puede estar vacío' })
  @IsIn(['CREATE', 'UPDATE', 'DELETE', 'QUERY'], {
    message: 'action debe ser CREATE, UPDATE, DELETE o QUERY',
  })
  action!: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo title no puede estar vacío' })
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  payload?: any;
}