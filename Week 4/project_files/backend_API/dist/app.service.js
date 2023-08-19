"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const tokenJson = require("./assets/MyToken.json");
const ethers_1 = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
const CONTRACT_ADDRESS = process.env.MY_TOKEN_CONTRACT_ADDRESS ?? '';
const MINT_VALUE = ethers_1.ethers.parseUnits('1');
let AppService = exports.AppService = class AppService {
    constructor() {
        this.provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? '');
        this.wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY ?? '', this.provider);
        this.contract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, tokenJson.abi, this.wallet);
    }
    async mintTokens(address) {
        try {
            const tx = await this.contract.mint(address, MINT_VALUE);
            const receipt = await tx.wait(2);
            console.log('receipt: ', receipt);
            return {
                result: true,
                tx: receipt.hash,
                to: receipt.to,
                from: receipt.from,
                gasUsed: receipt.gasUsed.toString(),
            };
        }
        catch (err) {
            console.error(err);
            return { result: false, error: err };
        }
    }
};
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
//# sourceMappingURL=app.service.js.map