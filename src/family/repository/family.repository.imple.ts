import { Inject, Injectable } from '@nestjs/common';
import { FamilyRepositoryInterface } from './family.repository.interface';
import { CreateFamily, UpdateFamily } from '../dtos/family.dtos';
import { Family } from '../entities/family.entity';
import { ConstantsEnum, TableEnum } from '../../util/Constantes.enum';
import * as mysql from 'mysql2';
@Injectable()
export class FamilyRepositoryImplement implements FamilyRepositoryInterface {
  constructor(
    @Inject(ConstantsEnum.provideConnection) private connectionDB: mysql.Pool,
  ) {}
  findAll(limit: number, offset: number, page: number): Promise<any> {
    offset = (page - 1) * limit;
    let sql = `SELECT * FROM ${TableEnum.FAMILIA} where status_fam = 1 order by id_fam asc limit ${limit} offset ${offset}`;
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql);
        sql = `SELECT count(*) as count FROM ${TableEnum.FAMILIA} where status_fam = 1`;
        const count = await this.connectionDB.query(sql);
        const result = {
          limit,
          offset,
          totalRegistros: count && count[0].length > 0 ? count[0][0].count : 0,
          registros: res[0],
        };
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  findById(id: number): Promise<Family> {
    const sql = `SELECT * FROM ${TableEnum.FAMILIA} where id_fam = ? and status_fam = 1`;
    const values = [id];
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql, values);
        resolve(res[0][0] as Family);
      } catch (error) {
        reject(error);
      }
    });
  }
  async create(family: CreateFamily[]): Promise<boolean> {
    const sql = `INSERT INTO ${TableEnum.FAMILIA} (cod_fam, des_fam, status_fam) VALUES (?, ?, ?)`;
    let errors = [];
    return new Promise(async (resolve, reject) => {
      // const validateError = await this.validateDuplicados(family);
      // if (validateError.length > 0) {
      //   reject(validateError);
      //   return;
      // }
      for (const f of family) {
        const values = [f.codigo_familia.toUpperCase(), f.descripcion_familia.toUpperCase(), '1'];
        try {
          await this.connectionDB.query(sql, values);
        } catch (error) {
          errors.push(error);
        }
      }
      if (errors.length > 0) {
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }
  update(id: number, family: UpdateFamily): Promise<boolean> {
    const sql = `UPDATE ${TableEnum.FAMILIA} set cod_fam = ?, des_fam = ? WHERE id_fam = ?`;
    const values = [family.codigo_familia.toUpperCase(), family.descripcion_familia.toUpperCase(), id];
    return new Promise(async (resolve, reject) => {
      try {
        await this.connectionDB.query(sql, values);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM ${TableEnum.FAMILIA} WHERE id_fam = ?`;
    const values = [id];
    return new Promise(async (resolve, reject) => {
      try {
        await this.connectionDB.query(sql, values);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  async validateDuplicados(family: CreateFamily[]) {
    const sql = `select * from ${TableEnum.FAMILIA} where cod_fam = ? limit 1`;
    const errors = [];

    for (const item of family) {
      const values = [item.codigo_familia];

      try {
        const result = await this.connectionDB.query(sql, values);

        if (result[0].length > 0) {
          const error = {
            mensaje: `La Familia: ${item.codigo_familia} - ${item.descripcion_familia} ya se encuentra registrada`,
          };
          errors.push(error);
        }
      } catch (error) {
        console.error(
          `Error en la consulta SQL para ${item.codigo_familia}`,
          error,
        );
        const errorObj = {
          mensaje: `Error en la consulta SQL para ${item.codigo_familia}`,
        };
        errors.push(errorObj);
      }
    }

    if (errors.length > 0) {
      return errors;
    } else {
      return [];
    }
  }
  countGrupoXIdFamilia(id: number): Promise<any> {
    const sql = `SELECT sum(total_product) as total_product FROM ${TableEnum.GRUPO} where fam_id_familia = ?;`;
    const values = [id];
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql, values);
        resolve(res[0][0].total_product);
      } catch (error) {
        reject(error);
      }
    });
  }
}
