import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";

export class AtualizaCategoriaDto {

    @IsString()
    @IsNotEmpty()
    descricao: string

    @IsArray()
    @ArrayMinSize(1)
    eventos: Array<Evento>
}