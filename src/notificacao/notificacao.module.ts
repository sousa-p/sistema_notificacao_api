import { Module } from '@nestjs/common';
import { NotificacaoController } from './controllers/notificacao.controller';
import { NotificacaoService } from './services/notificacao.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConsumidorService } from 'src/consumidor/services/consumidor.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_PRODUTOR',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: process.env.QUEUE_ENTRADA,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [NotificacaoController],
  providers: [NotificacaoService, ConsumidorService],
})
export class NotificacaoModule {}
