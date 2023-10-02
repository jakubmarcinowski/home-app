import { Module } from '@nestjs/common';

import { ImageService } from './image.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
