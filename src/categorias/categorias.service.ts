import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizaCategoriaDto } from './dtos/atualiza-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService
        ){}

    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        
        const { categoria } = criarCategoriaDto

        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()

        if(categoriaEncontrada) {
            throw new BadRequestException(`Categoria ${categoria} já cadastrada. `)
        }
        const categoriaCriada = new this.categoriaModel(criarCategoriaDto)
        return await categoriaCriada.save()
    }

    async consultarTodasCategorias(): Promise<Array<Categoria>> {
        return await this.categoriaModel.find().populate('jogadores').exec()
    }

    async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {

        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()

        if (!categoriaEncontrada) {
            throw new NotFoundException(`Categoria ${categoria} não encontrada.`)
        }
        
        return categoriaEncontrada
    }

    async atualizarCategoria(categoria: string, atualizaCategoriaDto: AtualizaCategoriaDto): Promise<void> {
        
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()

        if (!categoriaEncontrada) {
            throw new NotFoundException(`Categoria ${categoria} não encontrada.`)
        }

        await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: atualizaCategoriaDto }).exec()

    }

    async atribuirCategoriaJogador(params: string[]): Promise<void> {
         
        const categoria = params['categoria']
        const jogadorId = params['jogador']

        // busca o id da categoria informada pelo cliente para vê se ele existe na tabela
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()

        // busca o id do jogador informado pelo cliente para vê se ele existe na tabela
        await this.jogadoresService.consultarJogadorPeloId(jogadorId)

        // Busca nos documentos categoria e nos subdocumentos do tipo jogadores pelo id informado pelo usuário
        const jogadorJaEncontradoCategoria = await this.categoriaModel.find({categoria}).where('jogadores').in(jogadorId).exec()

        if (!categoriaEncontrada) {
            throw new NotFoundException(`Categoria ${categoria} não encontrada.`)
        }

        if (jogadorJaEncontradoCategoria.length > 0) {
            throw new BadRequestException(`Jogador ${jogadorId} já cadastro na Categoria ${categoria}.`)
        }

        // adiciona o jogador ao array de jogadores na categoria e atualiza
        categoriaEncontrada.jogadores.push(jogadorId)
        await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: categoriaEncontrada }).exec()
    }
}
