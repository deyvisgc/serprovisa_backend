import { PartialType } from '@nestjs/mapped-types';
import {IsString, IsNotEmpty} from 'class-validator'
export class CreateFamily {
    @IsString()
    @IsNotEmpty()
    readonly codigo_familia: string;
    @IsString()
    @IsNotEmpty()
    readonly descripcion_familia: string;
  }
//PartialType => se usa para usar una clase poniendo sus valores opcionales
export class UpdateFamily extends PartialType(CreateFamily) {
}