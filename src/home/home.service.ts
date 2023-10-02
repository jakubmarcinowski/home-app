import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { HomeDTO, UpdateHomeDTO } from './dtos/home.dto';
import { defaultImage } from 'src/image/dto/image.dto';
import { ImageService } from 'src/image/image.service';

interface HomeFilters {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  propertyType?: string;
}

const homeSelect =
  'id, address, city, property_type, price, land_size, number_of_bedrooms, number_of_bathrooms, image(url)';

@Injectable()
export class HomeService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly imageService: ImageService,
  ) {}

  async listHomes({
    city,
    minPrice,
    maxPrice,
    propertyType,
  }: HomeFilters): Promise<HomeDTO[]> {
    const supabaseClient = await this.supabaseService.getClient();
    const query = supabaseClient
      .from('home')
      .select(homeSelect)
      .limit(1, { foreignTable: 'image' });

    if (city) query.ilike('city', city);
    if (minPrice) query.gte('price', minPrice);
    if (maxPrice) query.lte('price', maxPrice);
    if (propertyType) query.eq('property_type', propertyType);

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException(error.message);
    }
    if (data.length === 0) {
      throw new BadRequestException('No homes found');
    }

    const homes = data.map(
      (home) =>
        new HomeDTO({ ...home, image: home.image[0]?.url || defaultImage }),
    );

    return homes;
  }

  async getHomeById(id: string): Promise<HomeDTO> {
    const supabaseClient = await this.supabaseService.getClient();
    const { data, error } = await supabaseClient
      .from('home')
      .select(homeSelect)
      .eq('id', id)
      .limit(1, { foreignTable: 'image' })
      .maybeSingle();

    if (error) {
      throw new BadRequestException(error.message);
    }
    if (!data) {
      throw new BadRequestException(`No home found with id ${id}`);
    }
    return new HomeDTO({
      ...data,
      image: data?.image[0]?.url || defaultImage,
    });
  }

  async createHome({
    address,
    number_of_bathrooms,
    number_of_bedrooms,
    city,
    price,
    property_type,
    land_size,
    images,
  }: HomeDTO): Promise<HomeDTO> {
    const supabaseClient = await this.supabaseService.getClient();
    const { data, error } = await supabaseClient
      .from('home')
      .insert({
        address,
        number_of_bathrooms,
        number_of_bedrooms,
        city,
        price,
        land_size,
        property_type,
        seller_id: 'e49276e3-652a-4240-83ca-b4d4031077ab', // FIX-ME
      })
      .select(homeSelect)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    const homeImages = images.map((image) => ({
      ...image,
      home_id: data.id,
    }));

    const { error: ImagesError } =
      await this.imageService.saveImage(homeImages);
    if (ImagesError) {
      this.deleteHome(data.id);
      throw new BadRequestException(ImagesError.message);
    }

    return new HomeDTO({
      ...data,
      image: defaultImage,
    });
  }

  async updateHome(home: UpdateHomeDTO) {
    const supabaseClient = await this.supabaseService.getClient();
    const query = await supabaseClient
      .from('home')
      .update(home)
      .eq('id', home.id)
      .select(homeSelect)
      // .limit(1, { foreignTable: 'image' }) // FIX-ME
      .maybeSingle();

    const { data, error } = await query;
    if (error) {
      throw new BadRequestException(error.message);
    }
    if (!data) {
      throw new BadRequestException(`No home found with id ${home.id}`);
    }
    return new HomeDTO({
      ...data,
      image: data?.image[0]?.url || defaultImage,
    });
  }

  async deleteHome(id: number) {
    const supabaseClient = await this.supabaseService.getClient();
    const { error } = await supabaseClient
      .from('home')
      .delete()
      .eq('id', id)
      .single();
    if (error) {
      throw new BadRequestException(error.message);
    }
  }
}
