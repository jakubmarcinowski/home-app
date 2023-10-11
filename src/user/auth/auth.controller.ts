import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, SignInUserDTO, UserType } from 'src/user/dtos/user.dto';
import { Public } from 'src/app.decorator.public';
import { User, UserInfo } from 'src/supabase/decorators/supabase.derorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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

  @Public()
  @Post('signin')
  signIn(@Body() body: SignInUserDTO) {
    return this.authService.signIn(body);
  }

  @Get('me')
  getMe(@User() user: UserInfo) {
    return user;
  }
}
