import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FamilyRepositoryImplement } from '../repository/family.repository.imple';
import { CreateFamily, UpdateFamily } from '../dtos/family.dtos';
import { Family } from '../entities/family.entity';
import { Response } from '../../response/response';

@Injectable()
export class FamilyService {
  constructor(private familyRepository: FamilyRepositoryImplement) {}
  findAll(limit: number, offset: number, page: number): Promise<Family[]> {
    return this.familyRepository.findAll(limit, offset, page);
  }
  async findById(id: number): Promise<Family> {
    const family = await this.familyRepository.findById(id);
    if (!family) {
      throw new NotFoundException('Error', 'La Familia no existe');
    }
    return family;
  }

  async create(family: CreateFamily[]): Promise<Response> {
    let res = new Response();
    try {
      await this.familyRepository.create(family);
      res.cod = 200;
      res.message = `!Familia creada exitosamente!`;
      res.status = true;
      return res;
    } catch (err) {
      if (err && err.length > 0) {
        throw new ConflictException(err);
      } else {
        throw new InternalServerErrorException('Error', err.message);
      }
    }
  }
  async update(id: number, family: UpdateFamily): Promise<Response> {
    let res = new Response();
    const existGrupo = await this.familyRepository.countGrupoXIdFamilia(id)
    if (existGrupo > 0) throw new ConflictException(
        'Error',
        `La familia a actualizar ya cuenta con productos vinculados, no se puede actualizar`,
    );
    const exist = this.findById(id);
    if (exist) {
      try {
        await this.familyRepository.update(id, family);
        res.cod = 200;
        res.message = `!Familia actualiza exitosamente!`;
        res.status = true;
        return res;
      } catch (err) {
        if (err.message.includes('Duplicate entry')) {
          throw new ConflictException('Error', 
            `La familia: ${family.codigo_familia.toUpperCase()} - ${family.descripcion_familia.toUpperCase()} ya se encuentra registrada`,
          );
        } else {
          throw new InternalServerErrorException('Error', err.message);
        }
      }
    } else {
      throw new NotFoundException('Error', 'La Familia no existe');
    }
  }

  async delete(id: number) {
    try {
      let res = new Response();
      await this.familyRepository.delete(id);
      res.cod = 200;
      res.message = `!Familia Eliminada exitosamente!`;
      res.status = true;
      return res;
    } catch (err) {
      if (err.message.includes("foreign key constraint fails")) {
        throw new ConflictException('Error', `Imposible eliminar la familia. Hay lineas vinculados a él. Desvincula o elimine antes de intentar nuevamente`);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }
  // async exportarExcel() {
  //   const sheetName = 'familia';
  //   const columnHeaders = ['Codigo Familia', 'Descripción Familia'];
  //   const data = await this.familyRepository.findAll(100000, 0, 1)
  //   const listFamilia = []
  //   data.registros.forEach((row) => {
  //     const ro = [row.cod_fam, row.des_fam];
  //     listFamilia.push(ro)
  //   });
  //   return this.importarService.exportarExcel(sheetName, columnHeaders, listFamilia)
  // }
  // async exportarPdf(): Promise<ArrayBuffer> {
  //   const data = await this.familyRepository.findAll(100000, 0, 1)
  //   const listFamilia = []
  //   let contador = 0
  //   data.registros.forEach((row) => {
  //     const ro = [contador++, row.cod_fam, row.des_fam];
  //     listFamilia.push(ro)
  //   });
  //   const columnHeaders = ['N°', 'Codigo Familia', 'Descripción Familia'];
  //   return this.importarService.exportarPdf(listFamilia, columnHeaders, "Reporte de Familias de Productos")
  // }
  
}
