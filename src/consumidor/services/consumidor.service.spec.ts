import { ConsumidorService } from './consumidor.service';
import * as amqplib from 'amqplib';
import { randomInt } from 'crypto';

jest.mock('amqplib');
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomInt: jest.fn(),
}));

describe('ConsumidorService', () => {
  let service: ConsumidorService;

  const mockMensagem = {
    mensagemId: '1',
    conteudoMensagem: 'conteudoMensagem',
  };

  const mensagemBuffer = {
    content: Buffer.from(JSON.stringify(mockMensagem)),
  };

  const mockRandomInt = 7;

  const ack = jest.fn();
  const sendToQueue = jest.fn();

  const consumeMock = jest.fn();

  const channelMock = {
    assertQueue: jest.fn(),
    consume: consumeMock,
    sendToQueue,
    ack,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (amqplib.connect as jest.Mock).mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(channelMock),
    });

    service = new ConsumidorService();
  });

  it('processar a mensagem e enviar status de sucesso', async () => {
    (randomInt as jest.Mock).mockReturnValue(mockRandomInt);

    await service.onModuleInit();

    const consumerCallback = consumeMock.mock.calls[0][1];
    await consumerCallback(mensagemBuffer);

    expect(channelMock.assertQueue).toHaveBeenCalledWith(
      process.env.QUEUE_ENTRADA,
      { durable: true },
    );
    expect(channelMock.assertQueue).toHaveBeenCalledWith(
      process.env.FILA_STATUS,
      { durable: true },
    );

    expect(sendToQueue).toHaveBeenCalledTimes(1);
    const sentBuffer = sendToQueue.mock.calls[0][1];
    const parsed = JSON.parse(sentBuffer.toString());
    expect(parsed.status).toBe('PROCESSADO_SUCESSO');

    expect(ack).toHaveBeenCalledWith(mensagemBuffer);
  });

  it('processar a mensagem e enviar status de falha', async () => {
    (randomInt as jest.Mock).mockReturnValue(mockRandomInt);

    await service.onModuleInit();

    const consumerCallback = consumeMock.mock.calls[0][1];
    await consumerCallback(mensagemBuffer);

    expect(sendToQueue).toHaveBeenCalledTimes(1);
    const sentBuffer = sendToQueue.mock.calls[0][1];
    const parsed = JSON.parse(sentBuffer.toString());
    expect(parsed.status).toBe('FALHA_PROCESSAMENTO');

    expect(ack).toHaveBeenCalledWith(mensagemBuffer);
  });
});
