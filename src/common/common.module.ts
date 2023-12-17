import { Module } from '@nestjs/common';
import { ImportarService } from './importar/importar.service';

@Module({
  providers: [ImportarService],
  exports: [ImportarService]
})
export class CommonModule {}
