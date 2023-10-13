import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { HomeDTO, MessageDTO, UpdateHomeDTO } from './dtos/home.dto';
import { defaultImage } from 'src/image/dto/image.dto';
import { ImageService } from 'src/image/image.service';
import { UserInfo } from 'src/supabase/decorators/supabase.derorator';

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
      throw new NotFoundException('No homes found');
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
      throw new NotFoundException(`No home found with id ${id}`);
    }
    return new HomeDTO({
      ...data,
      image: data?.image[0]?.url || defaultImage,
    });
  }

  async createHome(
    {
      address,
      number_of_bathrooms,
      number_of_bedrooms,
      city,
      price,
      property_type,
      land_size,
      images,
    }: HomeDTO,
    seller_id: string,
  ) {
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
        seller_id,
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
      .single();

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
    const { data, error } = await supabaseClient
      .from('home')
      .delete()
      .eq('id', id)
      .select();
    if (error) {
      throw new BadRequestException(error.message);
    }
    if (data.length !== 1) {
      throw new BadRequestException(`No home found with id ${id}`);
    }
  }

  async getSellerIDByHomeId(id: number) {
    const supabaseClient = await this.supabaseService.getClient();
    const { data, error } = await supabaseClient
      .from('home')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data.seller_id;
  }

  async inquire(
    homeId: number,
    buyer: UserInfo,
    { message }: MessageDTO,
  ): Promise<MessageDTO> {
    const supabaseClient = await this.supabaseService.getClient();
    const sellerID = await this.getSellerIDByHomeId(homeId);
    if (sellerID === buyer.id) {
      throw new BadRequestException('You cannot inquire about your own home');
    }
    const { data, error } = await supabaseClient
      .from('message')
      .insert({
        home_id: homeId,
        buyer_id: buyer.id,
        message,
        seller_id: sellerID,
      })
      .select('id, message')
      .single();
    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async getHomeMessages(homeId: number, sellerID: string) {
    const supabaseClient = await this.supabaseService.getClient();
    const { data, error } = await supabaseClient
      .from('message')
      .select('id, message, user:profiles!buyer_id(name, phone)')
      .eq('home_id', homeId)
      .eq('seller_id', sellerID);
    if (error) {
      throw new BadRequestException(error.message);
    }
    const messages = data.map((message) => new MessageDTO(message));
    return messages;
  }
}
