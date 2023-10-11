import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ExtractJwt } from 'passport-jwt';

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, handler: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (token) {
      const clientInstance = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        },
      );
      const { data, error } = await clientInstance.auth.getUser(token);
      if (error) {
        throw new UnauthorizedException(error.message);
      }
      request.user = data.user;
    }
    return handler.handle();
  }
}
