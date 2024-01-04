import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { AdminRepositoryImplement } from '../repository/admin.repository.imple';
import { Users } from '../entities/users.entity';
import { Response } from '../../response/response';
import { compareHash, generateHash } from '../../util/handleBcrypt';
import { Login } from '../dtos/auth.dtos';
import { JwtService } from '@nestjs/jwt';
import { RegisterAdminDto, UpdateAdminDto } from '../dtos/register.dtos';
import { RoleRepositoryImplement } from '../repository/role.repository.imple';
import { Permisos } from '../entities/permiso.entity';

@Injectable()
export class AdminService {
  constructor(
    private adminRepository: AdminRepositoryImplement,
    private jwtService: JwtService,
    private roleService: RoleRepositoryImplement,
  ) { }
  async findAll(limit: number, offset: number, page: number): Promise<Users[]> {
    return this.adminRepository.findAll(limit, offset, page);
  }
  async getCountDashboard(): Promise<any[]> {
    return this.adminRepository.getCountDashboard();
  }

  async findById(id: number): Promise<Users> {
    const users = await this.adminRepository.findById(id);
    if (!users) {
      throw new NotFoundException('El usuario no existe');
    }
    return users;
  }

  async create(userBody: RegisterAdminDto): Promise<Response> {
    let res = new Response();
    try {
      const { password, ...user } = userBody;
      const userParse = {
        ...user,
        password: await generateHash(password),
      };
      await this.adminRepository.create(userParse);
      res.cod = 200;
      res.message = `!Usuario creado exitosamente!`;
      res.status = true;
      return res;
    } catch (err) {
      if (err.message.includes('Duplicate entry')) {
        throw new ConflictException(
          'Error',
          `Email ${userBody.email} ya existe`,
        );
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async login(login: Login): Promise<any> {
    const { email, password } = login;
    const userExist = await this.adminRepository.findByEmail(email);
    if (!userExist) throw new NotFoundException('Error', `El email ${email} no existe`);
    const isCheck = await compareHash(password, userExist.us_password);
    if (!isCheck) throw new ConflictException('Error', `La contraseña es incorrecta`);
    const role = await this.roleService.findAll()
    const payload = {
      role: userExist.role_idrole,
      name: userExist.us_full_name,
      email: userExist.us_username,
      id: userExist.id_user,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: role
    };
  }
  async update(id: number, users: UpdateAdminDto): Promise<any> {
    let res = new Response();
    const exist = this.findById(id);
    if (exist) {
      try {
        await this.adminRepository.update(id, users);
        res.cod = 200;
        res.message = `!Usuario actualizado exitosamente!`;
        res.status = true;
        return res;
      } catch (err) {
        if (err.message.includes('Duplicate entry')) {
          throw new ConflictException(
            'Error',
            `Email ${users.email} ya existe`,
          );
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    } else {
      throw new NotFoundException('El usuario No existe');
    }
  }

  async delete(id: number) {
    try {
      let res = new Response();
      await this.adminRepository.delete(id);
      res.cod = 200;
      res.message = `!Usuario Eliminado exitosamente!`;
      res.status = true;
      return res;
    } catch (err) {
      if (err.message.includes("foreign key constraint fails")) {
        throw new ConflictException('Error', `Imposible eliminar este usuario. Hay productos vinculados a él. Desvincula o elimine antes de intentar nuevamente`);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }
  async validateUser(username: string): Promise<any> {
    const user = await this.adminRepository.findByEmail(username);
    if (user) {
      const { us_password, ...result } = user;
      return result;
    }
    return null;
  }
  async findRole() {
    return this.roleService.findAll();
  }
  async findPermisos(): Promise<Permisos[]> {
    return this.adminRepository.getPermisos();
  }
  async findPermisosUsers(id: number): Promise<Permisos[]> {
    return this.adminRepository.getPermisosUsers(id);
  }
}
