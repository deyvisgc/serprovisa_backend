import { Linea } from "../entities/linea";
import { CreateLinea, UpdateLinea } from "../dtos/linea.dtos";
export interface LineaRepositoryInterface {
    findAll(limit: number, offset: number, page: number): Promise<Linea[]>;
    findById(id: number): Promise<Linea>;
    findByIdFamilia(id:number): Promise<Linea[]>
    create(user: CreateLinea[]): Promise<boolean>;
    update(id: number, user: UpdateLinea): Promise<boolean>;
    delete(id: number): Promise<boolean>;
  }