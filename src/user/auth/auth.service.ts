import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import {
  CreateUserDTO,
  SignInUserDTO,
  UserResponseDTO,
  UserType,
} from 'src/user/dtos/user.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signIn({ email, password }: SignInUserDTO): Promise<UserResponseDTO> {
    const supabaseClient = await this.supabaseService.getClient();
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new BadRequestException(error.message);
    }
    return new UserResponseDTO({
      token: data.session.access_token,
    });
  }

  async signUp(
    body: CreateUserDTO,
    userType: UserType,
  ): Promise<UserResponseDTO> {
    const { email, password } = body;
    const supabaseClient = await this.supabaseService.getClient();
    const { data: authUser, error: signUpError } =
      await supabaseClient.auth.signUp({
        email,
        password,
      });
    if (signUpError) {
      throw new BadRequestException(signUpError.message);
    }
    this.createProfile({
      ...body,
      userType,
      id: authUser.user.id,
    });
    return new UserResponseDTO({
      token: authUser.session.access_token,
    });
  }

  private async createProfile({
    name,
    phone,
    id,
    userType,
  }: CreateUserDTO & { id: string; userType: UserType }) {
    const supabaseClient = await this.supabaseService.getClient();
    const { error: userError } = await supabaseClient
      .from('profiles')
      .insert({ name, phone, id, user_type: userType })
      .select()
      .single();
    if (userError) {
      this.removeUser(id);
      throw new BadRequestException(userError.message);
    }
  }

  private async removeUser(id: string) {
    const supabaseClient = await this.supabaseService.getClient();
    const { error } = await supabaseClient.auth.admin.deleteUser(id);
    if (error) {
      throw new BadRequestException(error.message);
    }
  }
}
