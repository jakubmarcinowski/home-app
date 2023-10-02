import { Injectable, Scope } from '@nestjs/common';
import { ImageDTO } from './dto/image.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async saveImage(image: ImageDTO[]) {
    const supabaseClient = await this.supabaseService.getClient();
    const result = await supabaseClient.from('image').insert(image);
    return result;
  }
}
