
import {IsNotEmpty, IsEmail, MinLength, MaxLength} from 'class-validator'
export class Login {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @MinLength(6)
    @MaxLength(20)
    password: string;
  }