import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { FamilyService } from '../services/family.service';
import { CreateFamily, UpdateFamily } from '../dtos/family.dtos';
import { JwtAuthGuard } from '../../admin/auth.guard'; 
import { Response } from 'express';
@Controller('api/v1/family')
export class FamilyController {
    constructor(private familyService: FamilyService) {}
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(
      @Query('limit') limit = 10,
      @Query('offset') offset = 0,
      @Query("page") page = 1
    ) {
      return this.familyService.findAll(limit, offset, page);
    }
    // @UseGuards(JwtAuthGuard)
    // @Get('export/excel')
    // async exportExcel(@Res() res: Response): Promise<void> {

    //   try {
    //     const buffer = await this.familyService.exportarExcel();
    //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     res.setHeader('Content-Disposition', 'attachment; filename=nombre-del-archivo.xlsx');
    //     res.send(buffer);
    //   } catch (error) {
    //     console.error('Error al generar el PDF:', error);
    //     res.status(500).send(error);
    //   }
    // }
    // @UseGuards(JwtAuthGuard)
    // @Get('export/pdf')
    // async generatePdf(@Res() res: Response): Promise<void> {
    //   try {
    //     const pdfBuffer = await this.familyService.exportarPdf();
  
    //     res.setHeader('Content-Type', 'application/pdf');
    //     res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
    //     res.send(Buffer.from(pdfBuffer));
    //   } catch (error) {
    //     console.error('Error al generar el PDF:', error);
    //     res.status(500).send('Error al generar el PDF');
    //   }
    // }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    getById(@Param('id', ParseIntPipe)  id: number) {
      return this.familyService.findById(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
     create(@Body() family: CreateFamily[]) {
      return this.familyService.create(family);
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateFamily) {
      
      return this.familyService.update(id, payload);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.familyService.delete(id);
    }
}
