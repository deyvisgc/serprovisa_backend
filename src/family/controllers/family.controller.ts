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
