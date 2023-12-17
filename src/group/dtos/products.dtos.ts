import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty} from 'class-validator'
export class CreateProductDto {
    @IsNotEmpty()
    readonly cod_product: string;
    @IsNotEmpty()
    readonly name_product: string;
    @IsNotEmpty()
    readonly des_product: string;
    readonly id_grupo: number;
    @IsNotEmpty()
    readonly id_user: number;
  }
//PartialType => se usa para usar una clase poniendo sus valores opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {
}