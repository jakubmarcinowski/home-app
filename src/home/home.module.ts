import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [SupabaseModule, ImageModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
