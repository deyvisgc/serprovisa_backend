import {ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { ProductoRepositoryImplement } from '../repository/product.repository.imple';
import { Product } from '../entities/product.entity';
import { Response } from '../../response/response';
import { ImportarService } from '../../common/importar/importar.service';
@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductoRepositoryImplement, private importarService: ImportarService) {}
  findAll(limit: number, offset: number, page: number, fech_ini: string, fech_fin: string, familia: number, linea: number, group:number, users:number): Promise<Product[]> {
      return this.productRepository.findAll(limit, offset, page, fech_ini, fech_fin, familia, linea, group, users)
  }
  findLastProducts () {
    return this.productRepository.findLastProducts()
  }
  findReport () {
    return this.productRepository.findReport()
  }
  async findById(id: number): Promise<Product> {
      const producto = await this.productRepository.findById(id);
      if (!producto) {
          throw new NotFoundException("Error, El producto no existe");
      }
      return producto
  }

  async create(group: CreateProductDto[]): Promise<Response> {
      let res = new Response()
      try {
           await this.productRepository.create(group)
           res.cod = 200
           res.message = `!Producto creado exitosamente!`
           res.status = true
          return res;
      }catch (err) {
          if (err && err.length > 0) {
            throw new ConflictException(err);
          } else {
            throw new InternalServerErrorException('Error', err.message);
          }
      }
  }
  async createMasivo(group: CreateProductDto[]): Promise<Response> {
    let res = new Response()
    try {
         await this.productRepository.createMasivo(group)
         res.cod = 200
         res.message = `!Producto creado exitosamente!`
         res.status = true
        return res;
    }catch (err) {
        if (err && err.length > 0) {
            throw new ConflictException(err);
        } else {
            throw new InternalServerErrorException('Error', err.message);
        }
    }
}
  async update(id: number, product: UpdateProductDto): Promise<Response>  {
      let res = new Response()
      const exist = this.findById(id);
      if (exist) {
          try {
              await this.productRepository.update(id, product)
              res.cod = 200
              res.message = `!Producto actualizado exitosamente!`
              res.status = true
              return res;
         }catch (err) {
             if (err.message.includes("Duplicate entry")) {
                 throw new ConflictException('Error', `El Producto: ${product.cod_product.toUpperCase()}-${product.name_product.toUpperCase()} ya se encuentra registrado`);
             } else {
                 throw new InternalServerErrorException(err.message);
             }
         }
      } else {
          throw new NotFoundException('Error', "El producto no existe");;
      }
  }
  
  async delete(id: number) {
      try {
          let res = new Response()
          await this.productRepository.delete(id)
          res.cod = 200
          res.message = `!Producto Eliminado exitosamente!`
          res.status = true
          return res;
     }catch (err) {
        throw new InternalServerErrorException('Error',  err.message);
     }
  }
  async exportarExcel( fech_ini: string, fech_fin: string, familia: number, linea: number, group:number, users:number ) {
    const sheetName = 'Productos';
    const columnHeaders = [
      'Familia',
      'Linea',
      'Grupo',
      'Codigo Producto',
      'Nombre Producto',
      'Detalle Producto',
      'Responsable',
      'Fecha Registro'
    ];
    const producto = await this.productRepository.findAll(100000, 0, 1, fech_ini, fech_fin, familia, linea, group, users)
    const listProducto = [];
    producto.registros.forEach((row) => {
      const ro = [
        `${row.cod_fam}-${row.des_fam}`,
        `${row.cod_line}-${row.des_line}`,
        `${row.cod_gru}-${row.des_gru}`,
        row.cod_product,
        row.name_product,
        row.des_product,
        row.us_full_name,
        row.fech_regis
      ];
      listProducto.push(ro);
    });
    return await this.importarService.exportarExcel(
      sheetName,
      columnHeaders,
      listProducto
    );
  }
  async exportarPdf( fech_ini: string, fech_fin: string, familia: number, linea: number, group:number, users:number): Promise<ArrayBuffer> {
    const columnHeaders = [
        'Familia',
        'Linea',
        'Grupo',
        'Codigo Producto',
        'Nombre Producto',
        'Detalle Producto',
        'Responsable',
        'Fecha Registro'
      ];
    const producto = await this.productRepository.findAll(100000, 0, 1, fech_ini, fech_fin, familia, linea, group, users)
    const listProducto = [];
    producto.registros.forEach((row) => {
      const fecRegis = new Date(row.fech_regis).toISOString().slice(0, 10);
      const ro = [
        `${row.cod_fam}-${row.des_fam}`,
        `${row.cod_line}-${row.des_line}`,
        `${row.cod_gru}-${row.des_gru}`,
        row.cod_product,
        row.name_product,
        row.des_product,
        row.us_full_name,
        fecRegis
      ];
      listProducto.push(ro);
    });
    return this.importarService.exportarPdf( listProducto, columnHeaders, 'Reporte de Productos');
  }
}
