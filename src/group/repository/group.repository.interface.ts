import { CreateGroup, UpdateGroup } from "../dtos/group.dto";
import { Group } from "../entities/group.entity";

export interface GroupRepositoryInterface {
    findAll(limit: number, offset: number, page: number, fech_ini: string, fech_fin: string, familia: number, linea: number): Promise<Group[]>;
    findById(id: number): Promise<Group>;
    create(user: CreateGroup[]): Promise<boolean>;
    update(id: number, user: UpdateGroup): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    findByIdLinea(id:number): Promise<Group[]>
  }