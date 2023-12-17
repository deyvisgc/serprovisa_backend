import { Module } from '@nestjs/common';
import { LineaRepositoryImplement } from './repository/linea.repository.imple';
import { LineaService } from './services/linea/linea.service';
import { LineaController } from './controllers/linea/linea.controller';

@Module({
  providers: [LineaService, LineaRepositoryImplement],
  controllers: [LineaController]
})
export class LineaModule {}
