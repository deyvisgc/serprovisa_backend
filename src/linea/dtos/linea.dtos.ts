import { PartialType } from '@nestjs/mapped-types';
import {IsString, IsNotEmpty, IsNumber, IsPositive} from 'class-validator'
export class CreateLinea {
    @IsString()
    @IsNotEmpty()
    readonly cod_line: string;
    @IsString()
    @IsNotEmpty()
    readonly des_line: string;
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    readonly id_familia: number;
  }
//PartialType => se usa para usar una clase poniendo sus valores opcionales
export class UpdateLinea extends PartialType(CreateLinea) {
}