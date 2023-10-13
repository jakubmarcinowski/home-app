import { Reflector } from '@nestjs/core';
import { UserType } from 'src/user/dtos/user.dto';

export const Roles = Reflector.createDecorator<UserType | UserType[]>();
