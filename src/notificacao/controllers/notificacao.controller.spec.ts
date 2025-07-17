import { Test, TestingModule } from '@nestjs/testing';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoService } from '../services/notificacao.service';
import { CreateNotificacaoDto } from '../dto/create-notificacao.dto';

describe('NotificacaoController', () => {
  let controller: NotificacaoController;
  let serviceMock: { enviarNotificacao: jest.Mock };

  beforeEach(async () => {
    serviceMock = {
      enviarNotificacao: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificacaoController],
      providers: [
        {
          provide: NotificacaoService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<NotificacaoController>(NotificacaoController);
  });

  it('chamar o service com o DTO e retornar a resposta esperada', async () => {
    const dto: CreateNotificacaoDto = {
      mensagemId: '123',
      conteudoMensagem: 'Teste de mensagem',
    };

    const resultado = await controller.notificar(dto);

    expect(serviceMock.enviarNotificacao).toHaveBeenCalledWith(dto);
    expect(resultado).toEqual({
      status: 'ACEITO',
      mensagemId: dto.mensagemId,
    });
  });
});
