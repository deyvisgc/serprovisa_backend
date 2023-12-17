import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { CreateGroup, UpdateGroup } from '../dtos/group.dto';
import { JwtAuthGuard } from '../../admin/auth.guard';
import { Response } from 'express';
@Controller('api/v1/group')
export class GroupController {
    constructor(private groupService: GroupService) {}
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
    ) {
      const fam = familia !== "" ? parseInt(familia, 10) : 0
      const lin = linea !== "" ? parseInt(linea, 10) : 0
      return this.groupService.findAll(limit, offset, page, fecha_ini, fecha_fin, fam, lin);
    }
    @UseGuards(JwtAuthGuard)
    @Get("export/excel")
    async exportExcel(
      @Res() res: Response,
      @Query("fecha_ini") fecha_ini = "",
      @Query("fecha_fin") fecha_fin = "",
      @Query("familia") familia = "",
      @Query("linea") linea = ""
    ) {
 
      try {
        const fam = familia !== "" ? parseInt(familia, 10) : 0
        const lin = linea !== "" ? parseInt(linea, 10) : 0
        const buffer = await this.groupService.exportarExcel(fecha_ini, fecha_fin, fam, lin);
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
      @Query("linea") linea = ""
    ): Promise<void> {
      try {
        const fam = familia !== "" ? parseInt(familia, 10) : 0
        const lin = linea !== "" ? parseInt(linea, 10) : 0
        const pdfBuffer = await this.groupService.exportarPdf(fecha_ini, fecha_fin, fam, lin);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
        res.send(Buffer.from(pdfBuffer));
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send(error);
      }
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    getById(@Param('id', ParseIntPipe)  id: number) {
      return this.groupService.findById(id);
    }
    @UseGuards(JwtAuthGuard)
    @Get('/grupo-linea/:id')
    @HttpCode(HttpStatus.ACCEPTED)
    getByIdFamilia(@Param('id', ParseIntPipe)  id: number) {
      return this.groupService.findByIdLinea(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
     create(@Body() group: CreateGroup[]) {
      try {
        return this.groupService.create(group);
      } catch (error) {
        return { error: 'Error fetching group', message: error.message };
      }
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateGroup) {
      return this.groupService.update(id, payload);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.groupService.delete(id);
    }
}
