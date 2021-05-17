import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    private readonly logger = new Logger(AllExceptionsFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        
        /* o contexto busca desse método switchToHttp informações como dados de request e dados de response
        
        */
        const ctx = host.switchToHttp()
        const request = ctx.getRequest()
        const response = ctx.getResponse()

        const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const message = exception instanceof HttpException ? exception.getResponse() : 'Houve um erro no serviço.' 

        this.logger.error(`Http Status: ${statusCode} - Error Message: ${JSON.stringify(exception)}`)

        response.status(statusCode).json({
            timestamp: new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString(),
            path: request.url,
            error: message
        })
    }

}