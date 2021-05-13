import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name, true)

    // Buscando o objeto referente ao modelo do mongoose e injetando no construtor da classe
    constructor( @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador> ) {}

    async criarJogador(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
        this.logger.log(`criarJogador`)

        const { email } = criaJogadorDto
        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

        if (jogadorEncontrado) {
            throw new BadRequestException(`Jogador com e-mail ${email} já cadastrado.`)
        } 

        const jogadorCriado = new this.jogadorModel(criaJogadorDto)
        return await jogadorCriado.save()
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
        this.logger.log(`atualizarJogador`)

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec()

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com o id ${_id} não encontrado.`)
        } 

        await this.jogadorModel.findOneAndUpdate({ _id }, { $set: atualizarJogadorDto }).exec()
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        this.logger.log(`consultarTodosJogadores`)
        return await this.jogadorModel.find().exec()
    } 

    async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
        this.logger.log(`consultarJogadorPeloEmail: ${email}`)

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

        if (!jogadorEncontrado) { 
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado.`)
        } 
        return jogadorEncontrado
    }

    async consultarJogadorPeloId(_id: string): Promise<Jogador> {
        this.logger.log(`consultarJogadorPeloId: ${_id}`)

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec()

        if (!jogadorEncontrado) { 
            throw new NotFoundException(`Jogador com e-mail ${_id} não encontrado.`)
        } 
        return jogadorEncontrado
    }

    async deletarJogadorPorEmail(email: string): Promise<any> {
        this.logger.log(`deletarJogador: ${email}`)

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()
        if (!jogadorEncontrado) { 
            throw new NotFoundException(`Jogador com e-mail ${email} não encontrado para deleção.`) 
        }

        await this.jogadorModel.remove({ email }).exec()
    }

    async deletarJogadorPorId(_id: string): Promise<any> {
        this.logger.log(`deletarJogador: ${_id}`)

        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec()
        if (!jogadorEncontrado) { 
            throw new NotFoundException(`Jogador com e-mail ${_id} não encontrado para deleção.`) 
        }

        await this.jogadorModel.remove({ _id }).exec()
    }
 }
