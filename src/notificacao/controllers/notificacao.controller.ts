import { Controller, Post, Body, HttpCode, Inject } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateNotificacaoDto } from '../dto/create-notificacao.dto';
import { NotificacaoService } from '../services/notificacao.service';

@ApiTags('Notificações')
@Controller('api/notificar')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Post()
  @HttpCode(202)
  @ApiBody({ type: CreateNotificacaoDto })
  @ApiResponse({
    status: 202,
    description: 'Mensagem aceita para processamento assíncrono.',
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  async notificar(@Body() dto: CreateNotificacaoDto) {
    await this.notificacaoService.enviarNotificacao(dto);
    return {
      status: 'ACEITO',
      mensagemId: dto.mensagemId,
    };
  }
}
