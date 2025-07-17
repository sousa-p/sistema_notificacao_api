import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateNotificacaoDto {
  @ApiProperty({ description: 'ID único da mensagem (UUID)' })
  @IsUUID()
  mensagemId: string;

  @ApiProperty({ description: 'Conteúdo da mensagem de notificação' })
  @IsNotEmpty({ message: 'conteudoMensagem não pode ser vazio' })
  conteudoMensagem: string;
}