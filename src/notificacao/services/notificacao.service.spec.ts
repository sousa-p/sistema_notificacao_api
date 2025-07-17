import { Test, TestingModule } from '@nestjs/testing';
import { NotificacaoService } from './notificacao.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificacaoDto } from '../dto/create-notificacao.dto';

describe('NotificacaoService', () => {
  let service: NotificacaoService;
  let clientProxyMock: {
    emit: jest.Mock;
  };

  beforeEach(async () => {
    clientProxyMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacaoService,
        {
          provide: 'RABBITMQ_PRODUTOR',
          useValue: clientProxyMock,
        },
      ],
    }).compile();

    service = module.get<NotificacaoService>(NotificacaoService);
  });

  it('emitir uma notificação', async () => {
    const dto: CreateNotificacaoDto = {
      mensagemId: '1',
      conteudoMensagem: 'conteudoMensagem',
    };

    await service.enviarNotificacao(dto);

    expect(clientProxyMock.emit).toHaveBeenCalledWith(
      process.env.QUEUE_ENTRADA!,
      dto,
    );

    const result = clientProxyMock.emit.mock.results[0].value;
    expect(result.toPromise).toHaveBeenCalled();
  });
});
