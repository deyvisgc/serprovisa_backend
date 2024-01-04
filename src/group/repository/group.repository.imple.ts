import { Inject, Injectable } from '@nestjs/common';
import { ConstantsEnum, TableEnum } from '../../util/Constantes.enum';
import * as mysql from 'mysql2';
import { GroupRepositoryInterface } from './group.repository.interface';
import { Group } from '../entities/group.entity';
import { CreateGroup, UpdateGroup } from '../dtos/group.dto';
import * as mysql2 from 'mysql2/promise';
import { FamilyService } from '../../family/services/family.service';
import { LineaService } from '../../linea/services/linea/linea.service';
@Injectable()
export class GroupRepositoryImplement implements GroupRepositoryInterface {
  constructor(
    @Inject(ConstantsEnum.provideConnection) private connectionDB: mysql.Pool,
    private familService: FamilyService, private lineaService: LineaService
  ) {}
  findAllFilters(): Promise<any> {
    const sql = `SELECT * FROM ${TableEnum.GRUPO}`;
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql);
        const result = {
          registros: res[0],
        };
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  findAll(
    limit: number,
    offset: number,
    page: number,
    fech_ini: string,
    fech_fin: string,
    familia: number,
    linea: number,
    grupo: number
  ): Promise<any> {
    offset = (page - 1) * limit;
    let query = `SELECT gru.*, fa.cod_fam, fa.des_fam, li.cod_line, li.des_line FROM ${TableEnum.GRUPO} as gru inner join ${TableEnum.LINEA} as li on gru.linea_id_line = li.id_line 
                    inner join ${TableEnum.FAMILIA} as fa on gru.fam_id_familia = fa.id_fam where status_gru = 1`;
    let queryCount = `SELECT count(*) as count FROM ${TableEnum.GRUPO} as gru inner join ${TableEnum.LINEA} as li on gru.linea_id_line = li.id_line 
                    inner join ${TableEnum.FAMILIA} as fa on gru.fam_id_familia = fa.id_fam where status_gru = 1`;
    return new Promise(async (resolve, reject) => {
      try {
        if (fech_ini && fech_fin) {
          query += ` AND fec_regis >= ${mysql2.escape(
            fech_ini,
          )} AND fec_regis <= ${mysql2.escape(fech_fin)}`;
          queryCount += ` AND fec_regis >= ${mysql2.escape(
            fech_ini,
          )} AND fec_regis <= ${mysql2.escape(fech_fin)}`;
        }

        if (familia > 0) {
          query += ` AND fam_id_familia = ${mysql2.escape(familia)}`;
          queryCount += ` AND fam_id_familia = ${mysql2.escape(familia)}`;
        }

        if (linea > 0) {
          query += ` AND linea_id_line = ${mysql2.escape(linea)}`;
          queryCount += ` AND linea_id_line = ${mysql2.escape(linea)}`;
        }
        if (grupo > 0) {
          query += ` AND id_grou  = ${mysql2.escape(grupo)}`;
          queryCount += ` AND id_grou  = ${mysql2.escape(grupo)}`;
        }
        query += ` ORDER BY gru.id_grou asc LIMIT ${limit} OFFSET ${offset}`;
        const res = await this.connectionDB.query(query);
        const count = await this.connectionDB.query(queryCount);
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
  findById(id: number): Promise<Group> {
    const sql = `SELECT * FROM ${TableEnum.GRUPO} where id_grou = ? and status_gru = 1`;
    const values = [id];
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql, values);
        resolve(res[0][0] as Group);
      } catch (error) {
        reject(error);
      }
    });
  }
  async create(group: CreateGroup[]): Promise<boolean> {
    const query = `INSERT INTO ${TableEnum.GRUPO} (cod_gru, des_gru, status_gru, linea_id_line, fec_regis, fam_id_familia, cod_gru_final) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let errors = [];
    return new Promise(async (resolve, reject) => {
      const validateError = await this.validateDuplicados(group);
      if (validateError.length > 0) {
        reject(validateError);
        return;
      }

      for (const g of group) {
        const familia = g.des_fam.substring(0, 3);
        const liena = g.des_line.substring(0, 3);
        const grupo = g.des_gru.substring(0, 3);
        const cod_gru_final = `${familia.toUpperCase()}-${liena.toUpperCase()}-${grupo.toUpperCase()}`;
        const values = [
          g.cod_gru.toUpperCase(),
          g.des_gru.toUpperCase(),
          '1',
          g.id_linea,
          new Date(),
          g.id_familia,
          cod_gru_final,
        ];
        try {
          await this.connectionDB.query(query, values);
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
  async update(id: number, group: UpdateGroup): Promise<boolean> {
    const sql = `UPDATE ${TableEnum.GRUPO} set cod_gru = ?, des_gru = ?, linea_id_line = ?, cod_gru_final = ? WHERE id_grou = ?`;
    return new Promise(async (resolve, reject) => {
      try {
        const family = await this.familService.findById(group.id_familia)
        const linea = await this.lineaService.findById(group.id_linea)
        if (!family || !linea) {
          resolve(false)
        } else {
          const codFami = family.cod_fam;
          const codLine = linea.cod_line;
          const codGrupo = group.des_gru.substring(0, 3);
          const cod_gru_final = `${codFami}-${codLine}-${codGrupo.toUpperCase()}`;
          const values = [group.cod_gru.toUpperCase(), group.des_gru.toUpperCase(), group.id_linea,cod_gru_final,id];
          await this.connectionDB.query(sql, values);
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  delete(id: number): Promise<boolean> {
    //const sql = `UPDATE ${TableEnum.GRUPO} set status_gru = 0 WHERE id_grou = ?`;
    const sql = `DELETE FROM ${TableEnum.GRUPO} WHERE id_grou = ?`;
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
  findByIdLinea(id: number): Promise<Group[]> {
    const sql = `SELECT * FROM ${TableEnum.GRUPO} where linea_id_line = ? and status_gru = 1`;
    const values = [id];
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql, values);
        resolve(res[0] as Group[]);
      } catch (error) {
        reject(error);
      }
    });
  }
  async validateDuplicados(family: CreateGroup[]) {
    const sql = `select * from ${TableEnum.GRUPO} where cod_gru = ? limit 1`;
    const errors = [];

    for (const item of family) {
      const values = [item.cod_gru];

      try {
        const result = await this.connectionDB.query(sql, values);

        if (result[0].length > 0) {
          const error = {
            mensaje: `El Grupo: ${item.cod_gru} - ${item.des_gru} ya se encuentra registrado`,
          };
          errors.push(error);
        }
      } catch (error) {
        const errorObj = {
          mensaje: `Error en la consulta SQL para ${item.cod_gru}`,
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
}
