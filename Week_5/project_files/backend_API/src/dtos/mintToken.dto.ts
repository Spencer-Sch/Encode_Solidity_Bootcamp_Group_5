import { ApiProperty, ApiResponse } from '@nestjs/swagger'

export class MintTokenBodyDto {
    @ApiProperty({ type: String, required: true, default: '' })
    address: string
}

export class MintTokenReturnDto {
    result: boolean
    tx: string
    to: string
    from: string
    gasUsed: string
}
