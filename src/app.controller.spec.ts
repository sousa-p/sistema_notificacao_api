import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appServiceMock: { getVersion: jest.Mock };

  beforeEach(async () => {
    appServiceMock = {
      getVersion: jest.fn().mockReturnValue('v1.0.0'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('retornar a versão da aplicação', () => {
    const result = appController.getVersion();
    expect(result).toBe('v1.0.0');
    expect(appServiceMock.getVersion).toHaveBeenCalled();
  });
});
