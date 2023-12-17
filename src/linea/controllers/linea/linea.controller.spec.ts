import { Test, TestingModule } from '@nestjs/testing';
import { LineaController } from './linea.controller';

describe('LineaController', () => {
  let controller: LineaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineaController],
    }).compile();

    controller = module.get<LineaController>(LineaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
