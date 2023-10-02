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

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

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

  @Get(':id')
  getHomeById(@Param('id', ParseIntPipe) id: string): Promise<HomeDTO> {
    return this.homeService.getHomeById(id);
  }

  @Post()
  createHome(@Body() body: HomeDTO): Promise<HomeDTO> {
    return this.homeService.createHome(body);
  }

  @Put(':id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
  ) {
    return this.homeService.updateHome({ ...body, id });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHome(id);
  }
}
