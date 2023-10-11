import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeDTO, PropertyType, UpdateHomeDTO } from './dtos/home.dto';
import { Public } from 'src/app.decorator.public';
import { User, UserInfo } from 'src/supabase/decorators/supabase.derorator';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { UserType } from 'src/user/dtos/user.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Public()
  @Get()
  listHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeDTO[]> {
    return this.homeService.listHomes({
      city,
      minPrice,
      maxPrice,
      propertyType,
    });
  }

  @Public()
  @Get(':id')
  getHomeById(@Param('id', ParseIntPipe) id: string): Promise<HomeDTO> {
    return this.homeService.getHomeById(id);
  }

  @Roles(UserType.seller)
  @Post()
  createHome(@Body() body: HomeDTO, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.seller)
  @Put(':id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
  ): Promise<HomeDTO> {
    return this.homeService.updateHome({ ...body, id });
  }

  @Roles(UserType.seller)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHome(id);
  }
}
