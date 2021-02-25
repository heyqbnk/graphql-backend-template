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
exports.UserQueriesResolver = void 0;
const type_graphql_1 = require("type-graphql");
const structures_1 = require("~/api/gql/structures");
const types_1 = require("~/shared/types");
const decorators_1 = require("~/api/gql/decorators");
const controllers_1 = require("~/shared/controllers");
const typedi_1 = require("typedi");
const errors_1 = require("~/api/gql/errors");
let UserQueriesResolver = class UserQueriesResolver {
    user(userId) {
        const user = this.controller.getById(userId);
        if (user === null) {
            throw new errors_1.UserNotFoundError();
        }
        return new structures_1.User(user);
    }
};
__decorate([
    typedi_1.Inject(() => controllers_1.UsersController),
    __metadata("design:type", controllers_1.UsersController)
], UserQueriesResolver.prototype, "controller", void 0);
__decorate([
    decorators_1.RequireRole({ oneOf: [types_1.EUserRole.Moderator, types_1.EUserRole.Admin] }),
    type_graphql_1.Query(() => structures_1.User, {
        description: 'Returns user by id',
        nullable: true,
    }),
    __param(0, type_graphql_1.Arg('userId', () => type_graphql_1.Int, {
        description: 'User identifier'
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], UserQueriesResolver.prototype, "user", null);
UserQueriesResolver = __decorate([
    type_graphql_1.Resolver()
], UserQueriesResolver);
exports.UserQueriesResolver = UserQueriesResolver;

//# sourceMappingURL=UserQueriesResolver.js.map
