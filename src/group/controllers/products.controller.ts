import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, ParseIntPipe, UseGuards, Res } from '@nestjs/common';
import { ProductsService } from '../../group/services/products.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dtos';
import { JwtAuthGuard } from '../../admin/auth.guard';
import { Response } from 'express';
@Controller('api/v1/products')
export class ProductsController {

    constructor(private productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query("page") page = 1,
    @Query("fecha_ini") fecha_ini = "",
    @Query("fecha_fin") fecha_fin = "",
    @Query("familia") familia = "",
    @Query("linea") linea = "",
    @Query("grupo") grupo = "",
    @Query("user") user = "",
    
  ) {
    const fam = familia !== "" ? parseInt(familia, 10) : 0
    const lin = linea !== "" ? parseInt(linea, 10) : 0
    const group = grupo !== "" ? parseInt(grupo, 10) : 0
    const users = user !== "" ? parseInt(user, 10) : 0
    return this.productsService.findAll(limit, offset, page, fecha_ini, fecha_fin, fam, lin, group, users);
  }
  @UseGuards(JwtAuthGuard)
  @Get('lastProducts')
  @HttpCode(HttpStatus.ACCEPTED)
  getLastProducts() {
    return this.productsService.findLastProducts();
  }
  @UseGuards(JwtAuthGuard)
  @Get('report')
  @HttpCode(HttpStatus.ACCEPTED)
  getReport() {
    return this.productsService.findReport();
  }
  @UseGuards(JwtAuthGuard)
    @Get("export/excel")
    async exportExcel(
      @Res() res: Response,
      @Query("fecha_ini") fecha_ini = "",
      @Query("fecha_fin") fecha_fin = "",
      @Query("familia") familia = "",
      @Query("linea") linea = "",
      @Query("grupo") grupo = "",
      @Query("user") user = "",
    ) {
 
      try {
        const fam = familia !== "" ? parseInt(familia, 10) : 0
        const lin = linea !== "" ? parseInt(linea, 10) : 0
        const group = grupo !== "" ? parseInt(grupo, 10) : 0
        const users = user !== "" ? parseInt(user, 10) : 0
        const buffer = await this.productsService.exportarExcel(fecha_ini, fecha_fin, fam, lin, group, users);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=nombre-del-archivo.xlsx');
        res.send(buffer);
      } catch (error) {
        console.error('Error al generar el archivo excel:', error);
        res.status(500).send(error);
      }
    }
    @UseGuards(JwtAuthGuard)
    @Get('export/pdf')
    async generatePdf(
      @Res() res: Response,
      @Query("fecha_ini") fecha_ini = "",
      @Query("fecha_fin") fecha_fin = "",
      @Query("familia") familia = "",
      @Query("linea") linea = "",
      @Query("grupo") grupo = "",
      @Query("user") user = "",
    ): Promise<void> {
      try {
        const fam = familia !== "" ? parseInt(familia, 10) : 0
        const lin = linea !== "" ? parseInt(linea, 10) : 0
        const group = grupo !== "" ? parseInt(grupo, 10) : 0
        const users = user !== "" ? parseInt(user, 10) : 0
        const buffer = await this.productsService.exportarPdf(fecha_ini, fecha_fin, fam, lin, group, users);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
        res.send(Buffer.from(buffer));
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send(error);
      }
    }
  @UseGuards(JwtAuthGuard)
  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED)
  getOne(@Param('productId', ParseIntPipe)  productId: number) {
    return this.productsService.findById(productId);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() payload: CreateProductDto[]) {
    return this.productsService.create(payload);
  }
  @UseGuards(JwtAuthGuard)
  @Post("masivo")
  createMasivoProductGrupo(@Body() payload: CreateProductDto[]) {
    return this.productsService.createMasivo(payload);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateProductDto) {
    return this.productsService.update(id, payload);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
