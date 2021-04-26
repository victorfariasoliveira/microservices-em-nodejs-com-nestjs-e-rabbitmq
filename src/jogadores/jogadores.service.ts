import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name, true)

    // Buscando o objeto referente ao modelo do mongoose e injetando no construtor da classe
    constructor( @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador> ) {}

    async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void | Jogador> {
        this.logger.log(`criarAtualizarJogador`)

        const { email } = criaJogadorDto
        const jogadorEncontrado = await this.encontrar(email)

        if (jogadorEncontrado) { 
            this.atualizar(criaJogadorDto) 
        } 
        this.criar(criaJogadorDto)
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        this.logger.log(`consultarTodosJogadores`)
        return await this.encontrarTodos()
    } 

    async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
        this.logger.log(`consultarJogadorPeloEmail: ${email}`)

        const jogadorEncontrado = await this.encontrar(email)

        if (!jogadorEncontrado) { 
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado.`)
        } 
        return jogadorEncontrado
    }

    async deletarJogador(email: string): Promise<any> {
        this.logger.log(`deletarJogador: ${email}`)
        const jogadorEncontrado = await this.encontrar(email)
        if (!jogadorEncontrado) { 
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado para deleção.`) 
        }
        return await this.deletar(email)
    }

    // PRIVATE METHODS

    private async criar(criaJogadorDto: CriarJogadorDto): Promise<void> {

        const jogadorCriado = new this.jogadorModel(criaJogadorDto)
        await jogadorCriado.save()
        this.logger.log(`criar => jogadorCriado: ${JSON.stringify(jogadorCriado)}`)

        /* CAMPOS AINDA FALTANTES POIS NÃO EXISTEM NO DTO
            ranking: 'A',
            posicaoRanking: 1,
            urlFotoJogador: 'www.google.com.br/foto123.jpg'
        */
    }

    /* atualiza apenas o nome, único do atributo da interface jogador que está dentro do
        dto que não é read-only */
    private async atualizar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        this.logger.log(`atualizar: ${JSON.stringify(criaJogadorDto.nome)}`)
        return await this.jogadorModel.findOneAndUpdate({ email: criaJogadorDto.email }, { $set: criaJogadorDto }).exec()
    }

    private async encontrar(email: string): Promise<Jogador> {
        const encontrado = await this.jogadorModel.findOne({ email }).exec()
        this.logger.log(`encontrar: ${JSON.stringify(encontrado)}`)
        return encontrado
    }

    private async encontrarTodos(): Promise<Jogador[]> {
        const encontrados = await this.jogadorModel.find().exec()
        this.logger.log(`encontrar: ${JSON.stringify(encontrados)}`)
        return encontrados
    }

    private async deletar(email: string) {
        this.logger.log(`deletar`)
        return await this.jogadorModel.remove({ email }).exec()
    }
 }
