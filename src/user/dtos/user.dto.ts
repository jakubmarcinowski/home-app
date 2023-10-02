import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export enum UserType {
  buyer = 'buyer',
  seller = 'seller',
  admin = 'admin',
}

export class SignInUserDTO {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateUserDTO extends SignInUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'invalid phone number',
  })
  phone: string;
}

export class UserResponseDTO {
  token: string;

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}
