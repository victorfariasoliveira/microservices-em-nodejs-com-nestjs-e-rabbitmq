import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import constantsDefault from './constants/default'
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    JogadoresModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot( process.env.MONGODB_URL, constantsDefault.config.mongodb )
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
