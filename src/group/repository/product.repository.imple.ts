import { Inject, Injectable } from "@nestjs/common";
import { ConstantsEnum, TableEnum } from "../../util/Constantes.enum";
import { ProductoRepositoryInterface } from "./product.repository.interface";
import { CreateProductDto, UpdateProductDto } from "../dtos/products.dtos";
import { Product } from "../entities/product.entity";
import * as mysql2 from 'mysql2/promise';
import * as mysql from 'mysql2';
@Injectable()
export class ProductoRepositoryImplement implements ProductoRepositoryInterface {
    constructor( @Inject(ConstantsEnum.provideConnection) private connectionDB: mysql.Pool) {}
    obtenerTotalProducto(limit: number, offset: number, page: number): Promise<any> {
        offset = (page - 1) * limit;
        const sql = `
        SELECT
        us.id_user,
        us.us_full_name, 
        fa.cod_fam,
        fa.des_fam,
        li.cod_line,
        li.des_line, 
        gr.cod_gru,
        gr.des_gru,
        SUM(gr.total_product) as total_productos
        FROM
        ${TableEnum.PRODUCTO} as pr
        INNER JOIN ${TableEnum.GRUPO} as gr ON pr.group_id_group = gr.id_grou
        INNER JOIN ${TableEnum.USERS} as us ON pr.user_id_user = us.id_user
        INNER JOIN ${TableEnum.FAMILIA} as fa ON gr.fam_id_familia = fa.id_fam
        INNER JOIN ${TableEnum.LINEA} as li ON gr.linea_id_line = li.id_line
        WHERE
            pr.status_product = 1
        GROUP BY
            us.id_user,
            us.us_full_name, 
            fa.cod_fam, fa.des_fam, 
            li.cod_line, li.des_line, 
            gr.cod_gru, gr.des_gru
        ORDER BY
         total_productos DESC 
        LIMIT ${limit} OFFSET ${offset}
        ` ; 
 
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.connectionDB.query(sql);
                const result = {
                    limit,
                    offset,
                    registros: res[0]
                }
                resolve(result);
              } catch (error) {
                reject(error);
            }
        });
    }
    findReport(): Promise<any[]> {
        const sql = `SELECT
                MONTH(fech_regis) AS mes,
                YEAR(fech_regis) AS year,
                COUNT(*) AS total_productos
            FROM
            ${TableEnum.PRODUCTO}
            WHERE
                status_product = 1
            GROUP BY
                MONTH(fech_regis),
                year(fech_regis);
        ` ; 
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.connectionDB.query(sql);
                resolve(res[0]);
              } catch (error) {
                reject(error);
            }
        });
    }
    findLastProducts(): Promise<any[]> {
        const sql = `SELECT
                    us.id_user,
                    us.us_full_name,
                    COUNT(p.id_prod) AS cantidad_productos
                FROM
                    ${TableEnum.USERS} AS us
                INNER JOIN
                ${TableEnum.PRODUCTO} AS p ON us.id_user = p.user_id_user where status_product = 1
                GROUP BY
                    us.id_user
                ORDER BY
                    us.id_user limit 10;
    ` ; 
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.connectionDB.query(sql);
                resolve(res[0]);
              } catch (error) {
                reject(error);
            }
        });
    }

    findAll(limit: number, offset: number, page: number, fech_ini: string, fech_fin: string, familia: number, linea: number, grupo: number, user: number): Promise<any> {
        offset = (page - 1) * limit;
        
        let query = `SELECT pr.*, gr.cod_gru, gr.des_gru, us.us_full_name, fa.cod_fam, fa.des_fam, li.cod_line, li.des_line
        FROM ${TableEnum.PRODUCTO} as pr inner join ${TableEnum.GRUPO} 
        as gr on pr.group_id_group = gr.id_grou 
        inner join ${TableEnum.USERS}  as us
        on pr.user_id_user = us.id_user
        inner join ${TableEnum.FAMILIA} as fa on gr.fam_id_familia = fa.id_fam
        inner join ${TableEnum.LINEA} as li on gr.linea_id_line = li.id_line
         where pr.status_product = 1`
         
        let queryCount = `SELECT count(*) as count FROM ${TableEnum.PRODUCTO} as pr inner join ${TableEnum.GRUPO} 
        as gr on pr.group_id_group = gr.id_grou 
        inner join ${TableEnum.USERS}  as us
        on pr.user_id_user = us.id_user
        inner join ${TableEnum.FAMILIA} as fa on gr.fam_id_familia = fa.id_fam
        inner join ${TableEnum.LINEA} as li on gr.linea_id_line = li.id_line
         where pr.status_product = 1`

                    
        return new Promise(async (resolve, reject) => {
            try {
                if (fech_ini && fech_fin) {
                    query += ` AND pr.fech_regis >= ${mysql2.escape(fech_ini)} AND pr.fech_regis <= ${mysql2.escape(fech_fin)}`;
                    queryCount += ` AND pr.fech_regis >= ${mysql2.escape(fech_ini)} AND pr.fech_regis <= ${mysql2.escape(fech_fin)}`;
                }
                if (familia > 0) {
                    query += ` AND gr.fam_id_familia = ${mysql2.escape(familia)}`;
                    queryCount += ` AND gr.fam_id_familia = ${mysql2.escape(familia)}`;
                }
                if (linea > 0) {
                    query += ` AND gr.linea_id_line = ${mysql2.escape(linea)}`;
                    queryCount += ` AND gr.linea_id_line = ${mysql2.escape(linea)}`;
                }
                if (grupo > 0) {
                    query += ` AND pr.group_id_group = ${mysql2.escape(grupo)}`;
                    queryCount += ` AND pr.group_id_group = ${mysql2.escape(grupo)}`;
                }
                if (user > 0) {
                    query += ` AND pr.user_id_user = ${mysql2.escape(user)}`;
                    queryCount += ` AND pr.user_id_user = ${mysql2.escape(user)}`;
                }
                
                query += ` ORDER BY pr.id_prod asc LIMIT ${limit} OFFSET ${offset}`;
                const res = await this.connectionDB.query(query);
                const count = await this.connectionDB.query(queryCount);
                const result = {
                    limit,
                    offset,
                    totalRegistros: count && count[0].length > 0 ? count[0][0].count: 0,
                    registros: res[0]
                }
                resolve(result);
              } catch (error) {
                reject(error);
            }
        });
    }
    findById(id: number): Promise<Product> {
        const sql = `SELECT * FROM ${TableEnum.PRODUCTO} where id_prod = ? and status_product = 1`;
        const values = [id];
        return new Promise(async (resolve, reject) => {
          try {
            const res = await this.connectionDB.query(sql, values);
            resolve(res[0][0] as Product);
          } catch (error) {
            reject(error);
          }
        });
    }
    create(product: CreateProductDto[]): Promise<boolean> {
        let query = `INSERT INTO ${TableEnum.PRODUCTO} (cod_product, name_product, des_product, status_product, group_id_group, user_id_user, fech_regis) VALUES (?, ?, ?, ?, ?, ?, ?)` ;
        let errors = []
        return new Promise(async (resolve, reject) => {
            for (const p of product) {
                const values = [p.cod_product.toUpperCase(), p.name_product.toUpperCase(), p.des_product.toUpperCase(), "1", p.id_grupo, p.id_user, new Date()];
                try {
                  await this.connectionDB.query(query, values);
                } catch (error) {
                  if (error.message.includes("Duplicate entry")) {
                      const error = { mensaje: `El Producto: ${p.cod_product.toUpperCase()} - ${p.des_product.toUpperCase()} ya se encuentra registrado`};
                      errors.push(error);
                  } else {
                    errors.push(error);
                  }
              }
            }
            if (errors.length > 0) {
                reject(errors)
            } else {
                query = `SELECT count(*) as totalProducto FROM ${TableEnum.PRODUCTO} where group_id_group = ? and cod_product LIKE ?`;
               
                const codigoSinNumeros = product[0].cod_product.split("-")

                let values = [product[0].id_grupo, `%${codigoSinNumeros[0]}-${codigoSinNumeros[1]}-${codigoSinNumeros[2]}%`]
                try {
                    const totalProducto = await this.connectionDB.query(query, values);
                    if (totalProducto && totalProducto[0].length > 0) {
                        query = `UPDATE ${TableEnum.GRUPO} set total_product = ? WHERE id_grou = ?` ;
                        values = [totalProducto[0][0].totalProducto, product[0].id_grupo]
                        await this.connectionDB.query(query, values);
                    }
                  } catch (error) {
                    errors.push(error);
                }

                if (errors.length > 0) {
                    reject(errors)
                } else {
                    resolve(true)
                }
            }
        });
    }
    createMasivo(product: CreateProductDto[]): Promise<boolean> {
        const queryInsert = `INSERT INTO ${TableEnum.PRODUCTO} (cod_product, name_product, des_product, status_product, group_id_group, user_id_user, fech_regis) VALUES (?, ?, ?, ?, ?, ?, ?)` ;
        let errors = []
        return new Promise(async (resolve, reject) => {
            for (const p of product) {

                try {
                    const valuesInsert = [p.cod_product.toUpperCase(), p.name_product.toUpperCase(), p.des_product.toUpperCase(), "1", p.id_grupo, p.id_user, new Date()];
            
                    await this.connectionDB.query(queryInsert, valuesInsert);
                    
                    const querySelect = `SELECT count(*) as totalProducto FROM ${TableEnum.PRODUCTO} where group_id_group = ? and cod_product LIKE ?`;
                    
                    const codigoSinNumeros = p.cod_product.split("-")
                
                    
                    const valuesSelect = [p.id_grupo, `%${codigoSinNumeros[0]}-${codigoSinNumeros[1]}-${codigoSinNumeros[2]}%`]
                    const totalProducto = await this.connectionDB.query(querySelect, valuesSelect);

                    if (totalProducto && totalProducto[0].length > 0) {
                        const queryUpdate = `UPDATE ${TableEnum.GRUPO} set total_product = ? WHERE id_grou = ?` ;
                        const valuesUpdate = [totalProducto[0][0].totalProducto, p.id_grupo]
                        await this.connectionDB.query(queryUpdate, valuesUpdate);
                    }

                } catch (error) {
                    if (error.message.includes("Duplicate entry")) {
                        const error = { mensaje: `El Producto: ${p.cod_product.toUpperCase()} - ${p.des_product.toUpperCase()} ya se encuentra registrado`};
                        errors.push(error);
                    } else {
                        errors.push(error);
                    }
                    
                }
            }
            if (errors.length > 0) {
                reject(errors)
            } else {
                resolve(true)
            }
        });
    }
    update(id: number, product: UpdateProductDto): Promise<boolean> {

        const sql = `UPDATE ${TableEnum.PRODUCTO} set name_product = ?, des_product = ? WHERE id_prod = ?`;
        const values = [product.name_product.toUpperCase(), product.des_product.toUpperCase(), id];
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
        throw new Error("Method not implemented.");
    }
    
}