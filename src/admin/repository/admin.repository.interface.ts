import { Users } from "../entities/users.entity";
import { RegisterAdminDto, UpdateAdminDto } from "../dtos/register.dtos";
import { Permisos } from "../entities/permiso.entity";
import { UsersPermisos } from "../entities/user_permisos.entity";

export interface AdminRepositoryInterface {
    findAll(limit: number, offset: number, page: number): Promise<Users[]>;
    
    findById(id: number): Promise<Users>;
    create(user: RegisterAdminDto): Promise<boolean>;
    update(id: number, user: UpdateAdminDto): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    findByEmail(email: string): Promise<Users>;
    getCountDashboard(): Promise<any>;
    getPermisos(): Promise<Permisos[]>;
    getPermisosUsers(id: number): Promise<UsersPermisos[]>;
  }