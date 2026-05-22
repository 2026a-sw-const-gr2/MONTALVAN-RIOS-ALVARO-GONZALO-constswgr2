import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInstrumentDto: CreateInstrumentDto) {
    return this.instrumentsService.create(createInstrumentDto);
  }

  @Get()
  findAll() {
    return this.instrumentsService.findAll();
  }

  @Get('summary')
  getInventorySummary() {
    return this.instrumentsService.getInventorySummary();
  }

  @Get('type/:tipo')
  findByTipo(@Param('tipo') tipo: string) {
    return this.instrumentsService.findByTipo(tipo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.instrumentsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInstrumentDto: UpdateInstrumentDto,
  ) {
    return this.instrumentsService.update(id, updateInstrumentDto);
  }

  @Put(':id/quantity')
  updateQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Query('change', ParseIntPipe) change: number,
  ) {
    return this.instrumentsService.updateQuantity(id, change);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.instrumentsService.remove(id);
  }
}
