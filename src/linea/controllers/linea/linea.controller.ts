import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../admin/auth.guard';
import { CreateLinea, UpdateLinea } from '../../dtos/linea.dtos';
import { LineaService } from '../../../linea/services/linea/linea.service';

@Controller('api/v1/linea')
export class LineaController {
    constructor(private lineaService: LineaService) {}
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(
      @Query('limit') limit = 10,
      @Query('offset') offset = 0,
      @Query("page") page = 1
    ) {
      return this.lineaService.findAll(limit, offset, page);
    }
    @UseGuards(JwtAuthGuard)
    @Get('/linea-familia/:id')
    @HttpCode(HttpStatus.ACCEPTED)
    getByIdFamilia(@Param('id', ParseIntPipe)  id: number) {
      return this.lineaService.findByIdFamilia(id);
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    getById(@Param('id', ParseIntPipe)  id: number) {
      return this.lineaService.findById(id);
    }
   
    @UseGuards(JwtAuthGuard)
    @Post()
     create(@Body() linea: CreateLinea[]) {
      try {
        return this.lineaService.create(linea);
      } catch (error) {
        return error
      }
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateLinea) {
      return this.lineaService.update(id, payload);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.lineaService.delete(id);
    }
}
