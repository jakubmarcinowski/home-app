import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ImageDTO } from 'src/image/dto/image.dto';

export enum PropertyType {
  residential = 'residential',
  condo = 'condo',
}

export class HomeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(3)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(3)
  city: string;

  image: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  images: ImageDTO[];

  @IsEnum(PropertyType)
  property_type: keyof typeof PropertyType;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  land_size: number;

  @IsNumber()
  @IsPositive()
  number_of_bedrooms: number;

  @IsNumber()
  @IsPositive()
  number_of_bathrooms: number;
  id: number;

  constructor(partial: Partial<HomeDTO>) {
    Object.assign(this, partial);
  }
}

export class UpdateHomeDTO extends PartialType(HomeDTO) {}

export class MessageDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @MinLength(4)
  message: string;

  id: number;

  constructor(partial: Partial<HomeDTO>) {
    Object.assign(this, partial);
  }
}
