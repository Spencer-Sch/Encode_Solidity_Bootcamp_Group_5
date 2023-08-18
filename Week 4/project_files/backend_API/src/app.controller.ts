import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { MintTokenDto } from './dtos/mintToken.dto'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello()
    }

    @Get('another-thing')
    getAnotherThing(): string {
        return this.appService.getAnotherThing()
    }

    @Get('contract-address')
    getContractAdress(): { address: string } {
        return this.appService.getContractAddress()
    }

    @Get('total-supply')
    getTotalSupply() {
        return this.appService.getTotalSupply()
    }

    // token-balance/0x8f741CE8580ad892D875Ca590a5d83A27B24fb3b
    @Get('token-balance/:address')
    getTokenBalance(@Param('address') address: string) {
        return this.appService.getTokenBalance(address)
    }

    // for POST requests it's better to send a body instead of parameters
    @Post('mint-tokens')
    async mintTokens(@Body() body: MintTokenDto) {
        console.log({ body })
        return await this.appService.mintTokens(body.address)
    }
}
