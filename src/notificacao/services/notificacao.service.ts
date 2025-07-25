import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificacaoDto } from '../dto/create-notificacao.dto';

@Injectable()
export class NotificacaoService {
  constructor(
    @Inject('RABBITMQ_PRODUTOR')
    private readonly client: ClientProxy,
  ) {}

  async enviarNotificacao(dto: CreateNotificacaoDto) {
    await this.client.emit(process.env.QUEUE_ENTRADA!, dto).toPromise();
  }
}
