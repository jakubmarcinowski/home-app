import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SupabaseModule } from './supabase/supabase.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HomeModule } from './home/home.module';
import { ImageModule } from './image/image.module';
import { SupabaseGuard } from './supabase/supabase.guard';
import { UserInterceptor } from './supabase/interceptors/supabase.interceptor';
import { RolesGuard } from './roles/guards/roles.guards';

@Module({
  controllers: [AppController],
  imports: [SupabaseModule, UserModule, HomeModule, ImageModule],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
