import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name, true)
    private jogadores: Jogador[] = []

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
        this.logger.log(`criarAtualizarJogador`)

        const { email } = criaJogadorDto
        const jogadorEncontrado = this.encontrar(email)

        if (jogadorEncontrado) {  
            this.atualizar(jogadorEncontrado, criaJogadorDto) 
        } else {
            this.criar(criaJogadorDto)
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        this.logger.log(`consultarTodosJogadores`)

        return this.jogadores
    } 

    async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
        this.logger.log(`consultarJogadorPeloEmail: ${email}`)

        const jogadorEncontrado = this.encontrar(email)

        if (!jogadorEncontrado) { 
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado.`)
        } else {
            return jogadorEncontrado
        }
    }

    async deletarJogador(email: string): Promise<void> {
        this.logger.log(`deletarJogador: ${email}`)
        
        const jogadorEncontrado = this.encontrar(email)
        if (!jogadorEncontrado) { 
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado para deleção.`) 
        } else {
            this.deletar(jogadorEncontrado)
        }
    }

    // PRIVATE METHODS

    private criar(criaJogadorDto: CriarJogadorDto): void {
        const { nome, telefoneCelular, email} = criaJogadorDto

        const jogador: Jogador = {
            _id: uuidv4(),
            nome,
            telefoneCelular,
            email,
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'www.google.com.br/foto123.jpg'
        }

        this.logger.log(`jogador: ${JSON.stringify(jogador)}`)

        this.jogadores.push(jogador)
    }

    /* atualiza apenas o nome, único do atributo da interface jogador que está dentro do
        dto que não é read-only */
    private atualizar(jogadorEncontrado: Jogador, criaJogadorDto: CriarJogadorDto): void {
        const { nome } = criaJogadorDto
        jogadorEncontrado.nome = nome
        this.logger.log(`atualizar: ${JSON.stringify(jogadorEncontrado.nome)}`)
    }

    private encontrar(email: string) {
        const encontrado = this.jogadores.find(jogador => jogador.email === email)
        this.logger.log(`encontrar: ${JSON.stringify(encontrado)}`)
        return encontrado
    }

    private deletar(jogadorEncontrado: Jogador) {
        this.logger.log(`deletar`)
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontrado.email)
    }
 }
