import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SupabaseModule } from './supabase/supabase.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HomeModule } from './home/home.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [UserModule, SupabaseModule, HomeModule, ImageModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
