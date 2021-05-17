import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto'
import constantsV1 from '../constants/api-v1'
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Controller(`${constantsV1.route.main}/jogadores`)
export class JogadoresController {

    constructor(private readonly jogadoresServices: JogadoresService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador( @Body() criaJogadorDto: CriarJogadorDto ) {
        return await this.jogadoresServices.criarJogador(criaJogadorDto)
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador( @Body() atualizarJogadorDto: AtualizarJogadorDto, @Param('_id', JogadoresValidacaoParametrosPipe) _id: string ) {
        await this.jogadoresServices.atualizarJogador(_id, atualizarJogadorDto)
    }

    @Get()
    async consultarJogadores(): Promise<Jogador[]> {
        return this.jogadoresServices.consultarTodosJogadores()
    }

    @Get()
    async consultarJogadoresPeloEmail( @Query('email', JogadoresValidacaoParametrosPipe) email: string ): Promise<Jogador> {
        return this.jogadoresServices.consultarJogadorPeloEmail(email)
    }

    @Get('/:_id')
    async consultarJogadoresPeloId( @Param('_id', JogadoresValidacaoParametrosPipe) _id: string ): Promise<Jogador> {
        return this.jogadoresServices.consultarJogadorPeloId(_id)
    }

    @Delete()
    async deletarJogadorPorEmail( @Query('email', JogadoresValidacaoParametrosPipe) email: string ): Promise<void> {
        return this.jogadoresServices.deletarJogadorPorEmail(email)
    }

    @Delete(':_id')
    async deletarJogadorPorId(@Param('_id', JogadoresValidacaoParametrosPipe) _id: string ): Promise<void> {
        return this.jogadoresServices.deletarJogadorPorId(_id)
    }
}
