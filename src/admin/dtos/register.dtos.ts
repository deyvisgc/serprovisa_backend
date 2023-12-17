import { PartialType } from '@nestjs/mapped-types';
import {IsString, IsNotEmpty, IsEmail, MinLength, MaxLength} from 'class-validator'
export class RegisterAdminDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    id_rol: number;
    @IsNotEmpty()
    modulo: any[]
  }
export class UpdateAdminDto extends PartialType(RegisterAdminDto) {
}