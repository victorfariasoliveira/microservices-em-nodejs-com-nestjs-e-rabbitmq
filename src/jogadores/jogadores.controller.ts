import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto'
import constantsV1 from '../constants/api-v1'
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

@Controller(`${constantsV1.route.main}/jogadores`)
export class JogadoresController {

    constructor(private readonly jogadoresServices: JogadoresService) {}

    @Post()
    async criarAtualizarJogador( @Body() criaJogadorDto: CriarJogadorDto ) {
        await this.jogadoresServices.criarAtualizarJogador(criaJogadorDto)
    }

    @Get()
    async consultarJogadores( @Query('email') email: string ): Promise<Jogador | Jogador[]> {
        if (email) {
            return this.jogadoresServices.consultarJogadorPeloEmail(email)
        } else {
            return this.jogadoresServices.consultarTodosJogadores()
        }
    }

    @Delete()
    async deletarJogador( @Query('email') email: string ): Promise<void> {
        return this.jogadoresServices.deletarJogador(email)
    }
}
