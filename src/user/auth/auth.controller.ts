import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, SignInUserDTO, UserType } from 'src/user/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/:userType')
  signUp(
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
    @Body() body: CreateUserDTO,
  ) {
    if (userType === UserType.admin) {
      throw new UnauthorizedException('Operation not allowed');
    }
    return this.authService.signUp(body, userType);
  }

  @Post('signin')
  signIn(@Body() body: SignInUserDTO) {
    return this.authService.signIn(body);
  }
}
