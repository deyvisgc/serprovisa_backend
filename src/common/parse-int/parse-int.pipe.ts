import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10)
    if (isNaN(val)) { // si es una cadena
        throw new BadRequestException(`${value} no es un numero`)
    }
    return value;
  }
}
