import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriaSchema } from './schemas/categoria.schema';

@Module({
  imports: [
    /* registro do schema JogadoSchema dentro do módulo Jogadores, passando 
       deixando disponível uma instancia do objeto dentro desse escopo 
       (singleton)
    */
    MongooseModule.forFeature([
        {
          name: 'Categoria', 
          schema: CategoriaSchema 
        }
      ]),
      JogadoresModule
    ],
  controllers: [CategoriasController],
  providers: [CategoriasService]
})
export class CategoriasModule {}
