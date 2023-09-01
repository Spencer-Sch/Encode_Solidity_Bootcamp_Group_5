import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { MintTokenBodyDto, MintTokenReturnDto } from './dtos/mintToken.dto'
import { ApiOkResponse, ApiResponse, getSchemaPath } from '@nestjs/swagger'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    // leave for future reference
    // token-balance/0x8f741CE8580ad892D875Ca590a5d83A27B24fb3b
    // @Get('token-balance/:address')
    // getTokenBalance(@Param('address') address: string) {
    //     return this.appService.getTokenBalance(address)
    // }
    //////////////////////////////////////

    // for POST requests it's better to send a body instead of parameters
    @Post('mint-tokens')
    // @ApiOkResponse({
    //     description: 'Mint Token TX Receipt',
    //     type: MintTokenReturnDto,
    //     schema: {
    //         example: {
    //             result: true,
    //             tx: '',
    //             to: '',
    //             from: '',
    //             gasUsed: '',
    //         },
    //     },
    // })
    @ApiResponse({
        status: '2XX',
        description: 'Mint Token TX Receipt',
        schema: {
            // $ref: getSchemaPath(MintTokenReturnDto),
            example: {
                result: true,
                tx: '',
                to: '',
                from: '',
                gasUsed: '',
            },
        },
    })
    async mintTokens(@Body() body: MintTokenBodyDto) {
        console.log({ body })
        return await this.appService.mintTokens(body.address)
    }
}
