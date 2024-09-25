import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The name of the order',
    example: 'Special order',
    minLength: 5,
    maxLength: 30,
  })
  @IsString({ message: 'Must be a string' })
  @MinLength(5)
  @MaxLength(30)
  @IsNotEmpty({ message: 'Is Required' })
  name: string;

  @ApiProperty({
    description: 'The description of the order',
    example: 'Special order description',
    minLength: 5,
    maxLength: 300,
  })
  @MinLength(5)
  @MaxLength(300)
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Books in order',
    example: ['It', 'Mist', 'The Shining'],
    minLength: 5,
    maxLength: 300,
  })
  @IsArray()
  @MinLength(5)
  @MaxLength(300)
  @IsString({ message: 'Must be a string', each: true })
  books: string[];
}
