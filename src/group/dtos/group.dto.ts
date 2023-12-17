import { PartialType } from '@nestjs/mapped-types';
import {IsString, IsNumber, IsNotEmpty, IsPositive} from 'class-validator'
export class CreateGroup {
    @IsString()
    @IsNotEmpty()
    readonly cod_gru: string;
    @IsString()
    @IsNotEmpty()
    readonly des_gru: string;
    @IsString()
    @IsNotEmpty()
    readonly des_fam: string;
    @IsString()
    @IsNotEmpty()
    readonly des_line: string;
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly id_linea: number;
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly id_familia: number;
  }
//PartialType => se usa para usar una clase poniendo sus valores opcionales
export class UpdateGroup extends PartialType(CreateGroup) {
}