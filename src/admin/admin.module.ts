import { Module } from '@nestjs/common';
import { AdminRepositoryImplement } from './repository/admin.repository.imple';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RoleRepositoryImplement } from './repository/role.repository.imple';
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          signOptions: { expiresIn: '4d' },
          global: true,
          secret: process.env.JWT_SECRET_KEY,
        };
      },
    })
  ],
  providers: [AdminService, AdminRepositoryImplement, RoleRepositoryImplement, JwtStrategy],
  controllers: [AdminController]
})
export class AdminModule {}