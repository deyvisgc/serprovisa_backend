import { CreateFamily, UpdateFamily } from "../dtos/family.dtos";
import { Family } from "../entities/family.entity";

export interface FamilyRepositoryInterface {
    findAll(limit: number, offset: number, page: number): Promise<Family[]>;
    findById(id: number): Promise<Family>;
    create(user: CreateFamily[]): Promise<boolean>;
    update(id: number, user: UpdateFamily): Promise<boolean>;
    delete(id: number): Promise<boolean>;
  }