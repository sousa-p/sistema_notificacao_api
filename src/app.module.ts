import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificacaoModule } from './notificacao/notificacao.module';
import { ConsumidorService } from './consumidor/services/consumidor.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NotificacaoModule,
  ],
  providers: [ConsumidorService],
})
export class AppModule {}
