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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const typedi_1 = require("typedi");
const chalk_1 = require("chalk");
const dayjs_1 = __importDefault(require("dayjs"));
const di_1 = require("~/shared/di");
/**
 * Responsible for messages logging.
 */
let Logger = class Logger {
    /**
     * Logs message into console.
     * @param args
     */
    log(...args) {
        if (this.config.appEnv === 'local') {
            console.log(chalk_1.bgGreenBright(chalk_1.black(chalk_1.bold('[Logger]'))), chalk_1.yellow(chalk_1.bold('[' + dayjs_1.default().format('hh:mm:ss')) + ']'), ...args);
        }
    }
};
__decorate([
    typedi_1.Inject(di_1.ConfigToken),
    __metadata("design:type", Object)
], Logger.prototype, "config", void 0);
Logger = __decorate([
    typedi_1.Service()
], Logger);
exports.Logger = Logger;

//# sourceMappingURL=Logger.js.map
