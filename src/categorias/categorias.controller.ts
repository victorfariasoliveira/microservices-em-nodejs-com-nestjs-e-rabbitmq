import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import constantsV1 from '../constants/api-v1'
import { CategoriasService } from './categorias.service';
import { AtualizaCategoriaDto } from './dtos/atualiza-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller(`${constantsV1.route.main}/categorias`)
export class CategoriasController {

    constructor(private readonly categoriasService: CategoriasService){}

    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria( @Body() criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        return await this.categoriasService.criarCategoria(criarCategoriaDto)
    }

    @Get()
    async consultarCategorias(): Promise<Array<Categoria>> {
        return await this.categoriasService.consultarTodasCategorias()
    }

    @Get('/:categoria')
    async consultarCategoriaPorId( @Param('categoria') categoria: string): Promise<Categoria> {
        return await this.categoriasService.consultarCategoriaPeloId(categoria)
    }

    @Put('/:categoria')
    @UsePipes(ValidationPipe)
    async atualizarCategoria(@Body() atualizarCategoriaDto: AtualizaCategoriaDto, @Param('categoria') categoria: string): Promise<void> {
        await this.categoriasService.atualizarCategoria(categoria, atualizarCategoriaDto)
    }

    @Post('/:categoria/jogadores/:jogador')
    async atribuirCategoriaJogador( @Param() params: string[] ): Promise<void> {
        return this.categoriasService.atribuirCategoriaJogador(params)
    }
}
