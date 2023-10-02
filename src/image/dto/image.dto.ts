import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export const defaultImage = 'https://fakeimg.pl/300/';

export class ImageDTO {
  @IsString()
  url: string;
  @Exclude()
  home_id: number;

  constructor(partial: Partial<ImageDTO>) {
    Object.assign(this, partial);
  }
}
