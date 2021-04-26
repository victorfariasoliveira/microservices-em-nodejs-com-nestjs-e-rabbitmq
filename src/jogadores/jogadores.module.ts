import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';
import { JogadorSchema } from './schemas/jogador.schema';

@Module({
  imports: [
    /* registro do schema JogadoSchema dentro do módulo Jogadores, passando 
       deixando disponível uma instancia do objeto dentro desse escopo 
       (singleton)
    */
    MongooseModule.forFeature([
        {
          name: 'Jogador', 
          schema: JogadorSchema
        }
      ])
    ],
  controllers: [JogadoresController],
  providers: [JogadoresService]
})
export class JogadoresModule {}
