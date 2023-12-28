import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { GroupRepositoryImplement } from './repository/group.repository.imple';
import { ProductsService } from './services/products.service';
import { ProductoRepositoryImplement } from './repository/product.repository.imple';
import { CommonModule } from '../common/common.module';
import { FamilyModule } from '../family/family.module';
import { LineaModule } from '../linea/linea.module';

@Module({
    imports: [CommonModule, FamilyModule, LineaModule],
    controllers: [ProductsController, GroupController],
    providers: [GroupService, ProductsService, GroupRepositoryImplement, ProductoRepositoryImplement]
})
export class GroupModule {}
