"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessController = void 0;
const types_1 = require("~/shared/types");
const typedi_1 = require("typedi");
const utils_1 = require("~/shared/utils");
let AccessController = class AccessController {
    /**
     * Creates user jwt.
     * @param id
     * @param scopes
     */
    createUserToken(id, scopes) {
        return utils_1.createUserJWT({ id, scopes });
    }
    /**
     * Creates default user token.
     * @param id
     */
    createDefaultUserToken(id) {
        return this.createUserToken(id, [types_1.EAccessScope.ReadUserInfo]);
    }
};
AccessController = __decorate([
    typedi_1.Service()
], AccessController);
exports.AccessController = AccessController;

//# sourceMappingURL=AccessController.js.map
