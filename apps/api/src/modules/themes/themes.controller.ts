import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ThemesService } from './themes.service';
import { ThemeResponseDto, ThemeListResponseDto } from './dto/theme.dto';

@ApiTags('themes')
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @ApiOperation({ summary: 'List all available themes' })
  @ApiResponse({
    status: 200,
    description: 'List of themes',
    type: ThemeListResponseDto,
  })
  async findAll(): Promise<ThemeListResponseDto> {
    const themes = await this.themesService.findAll();
    return { themes };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get theme by ID' })
  @ApiParam({ name: 'id', description: 'Theme ID', example: 'romantic' })
  @ApiResponse({
    status: 200,
    description: 'Theme details',
    type: ThemeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Theme not found' })
  async findOne(@Param('id') id: string): Promise<ThemeResponseDto> {
    const theme = await this.themesService.findOne(id);
    if (!theme) {
      throw new NotFoundException(`Theme ${id} not found`);
    }
    return theme;
  }
}
