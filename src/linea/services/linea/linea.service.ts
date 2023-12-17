import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLinea, UpdateLinea } from '../../../linea/dtos/linea.dtos';
import { Linea } from '../../../linea/entities/linea';
import { LineaRepositoryImplement } from '../../../linea/repository/linea.repository.imple';
import { Response } from '../../../response/response';

@Injectable()
export class LineaService {

    constructor(private lineaRepository: LineaRepositoryImplement) {}
    findAll(limit: number, offset: number, page: number): Promise<Linea[]> {
        return this.lineaRepository.findAll(limit, offset, page)
    }
    async findById(id: number): Promise<Linea> {
        const linea = await this.lineaRepository.findById(id);
        if (!linea) {
            throw new NotFoundException('Error', "La Linea no existe");
        }
        return linea
    }
    async findByIdFamilia(id: number): Promise<Linea[]> {
        const linea = await this.lineaRepository.findByIdFamilia(id);
        if (!linea) {
            throw new NotFoundException('Error', "La familia no existe");
        }
        return linea
    }

    async create(linea: CreateLinea[]): Promise<Response> {
        let res = new Response()
        try {
             await this.lineaRepository.create(linea)
             res.cod = 200
             res.message = `!Linea creada exitosamente!`
             res.status = true
            return res;
        }catch (err) {
            if (err && err.length > 0) {
                throw new ConflictException( err);
            } else {
                throw new InternalServerErrorException('Error', err.message);
            }
        }
    }
    async update(id: number, linea: UpdateLinea): Promise<Response>  {
        let res = new Response()
        const exist = this.findById(id);
        if (exist) {
            try {
                await this.lineaRepository.update(id, linea)
                res.cod = 200
                res.message = `!Linea actualiza exitosamente!`
                res.status = true
                return res;
           }catch (err) {
               if (err.message.includes("Duplicate entry")) {
                   throw new ConflictException('Error', `La Linea: ${linea.cod_line} - ${linea.des_line} ya se encuentra registrada`);
               } else {
                   throw new InternalServerErrorException('Error', err.message);
               }
           }
        } else {
            throw new NotFoundException('Error', "La Linea no existe");;
        }
    }
    
    async delete(id: number) {
        try {
            let res = new Response()
            await this.lineaRepository.delete(id)
            res.cod = 200
            res.message = `!Linea Eliminada exitosamente!`
            res.status = true
            return res;
       }catch (err) {
          throw new InternalServerErrorException('Error', err.message);
       }
    }
}
