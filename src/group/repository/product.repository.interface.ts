
import { CreateProductDto, UpdateProductDto } from "../dtos/products.dtos";
import { Product } from "../entities/product.entity";

export interface ProductoRepositoryInterface {
    findAll(limit: number, offset: number, page: number, fech_ini: string, fech_fin: string, familia: number, linea: number, group:number, users:number): Promise<any[]>;
    findById(id: number): Promise<Product>;
    create(user: CreateProductDto[]): Promise<boolean>;
    createMasivo(user: CreateProductDto[]): Promise<boolean>;
    update(id: number, user: UpdateProductDto): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    findLastProducts(): Promise<any[]>;
    findReport(): Promise<any[]>;
  }