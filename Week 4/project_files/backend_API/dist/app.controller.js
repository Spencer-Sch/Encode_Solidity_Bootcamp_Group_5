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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const mintToken_dto_1 = require("./dtos/mintToken.dto");
const swagger_1 = require("@nestjs/swagger");
let AppController = exports.AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async mintTokens(body) {
        console.log({ body });
        return await this.appService.mintTokens(body.address);
    }
};
__decorate([
    (0, common_1.Post)('mint-tokens'),
    (0, swagger_1.ApiResponse)({
        status: '2XX',
        description: 'Mint Token TX Receipt',
        schema: {
            example: {
                result: true,
                tx: '',
                to: '',
                from: '',
                gasUsed: '',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mintToken_dto_1.MintTokenBodyDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "mintTokens", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map