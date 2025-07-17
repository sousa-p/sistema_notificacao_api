import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Channel } from 'amqplib';
import { randomInt } from 'crypto';

@Injectable()
export class ConsumidorService implements OnModuleInit {
  private canal: Channel;

  async onModuleInit() {
    const conn = await connect(process.env.RABBITMQ_URL);
    this.canal = await conn.createChannel();
    await this.canal.assertQueue(process.env.QUEUE_ENTRADA, { durable: true });
    await this.canal.assertQueue(process.env.QUEUE_STATUS, { durable: true });

    this.canal.consume(process.env.QUEUE_ENTRADA, async (message: any) => {
      if (!message) return;

      const conteudo = JSON.parse(message.content.toString());

      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));

      const sucesso = randomInt(1, 11) > 2;
      const resposta = {
        mensagemId: conteudo.mensagemId,
        status: sucesso ? 'PROCESSADO_SUCESSO' : 'FALHA_PROCESSAMENTO',
      };

      this.canal.sendToQueue(
        process.env.QUEUE_STATUS,
        Buffer.from(JSON.stringify(resposta)),
      );

      this.canal.ack(message);
    });
  }
}
