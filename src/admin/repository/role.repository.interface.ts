
import { Role } from "../entities/role.entity";
export interface RoleRepositoryInterface {
    findAll(): Promise<Role[]>;
  }