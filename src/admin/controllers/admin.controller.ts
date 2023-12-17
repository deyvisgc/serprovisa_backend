import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { Login } from '../dtos/auth.dtos';
import { JwtAuthGuard } from './../auth.guard';
import { RegisterAdminDto, UpdateAdminDto } from '../dtos/register.dtos';

@Controller('api/v1/admin')
export class AdminController {
    constructor(private adminService: AdminService) {}
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(
      @Query('limit') limit = 10,
      @Query('offset') offset = 0,
      @Query("page") page = 1
    ) {
      return this.adminService.findAll(limit, offset, page);
    }
    @UseGuards(JwtAuthGuard)
    @Get("permisos")
    getPermisos(
    ) {
      return this.adminService.findPermisos();
    }
    @UseGuards(JwtAuthGuard)
    @Get("count-total")
    getCountDashboard() {
      return this.adminService.getCountDashboard();
    }

    @UseGuards(JwtAuthGuard)
    @Get("/role")
    getRole() {
      return this.adminService.findRole();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    getById(@Param('id', ParseIntPipe)  id: number) {
      return this.adminService.findById(id);
    }
    @UseGuards(JwtAuthGuard)
    @Get("permisos/:id")
    getPermisosUsers(@Param('id', ParseIntPipe)  id: number) {
      return this.adminService.findPermisosUsers(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
     create(@Body() user: RegisterAdminDto) {
      try {
        return this.adminService.create(user);
      } catch (error) {
        return error
      }
    }
    @Post("/login")
    @HttpCode(HttpStatus.OK)
    login(@Body() login: Login) {
     try {
       return this.adminService.login(login);
     } catch (error) {
       return error;
     }
   }
   @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateAdminDto) {
      return this.adminService.update(id, payload);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.adminService.delete(id);
    }
}
