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
const typedi_1 = require("typedi");
const controllers_1 = require("~/shared/controllers");
const errors_1 = require("~/api/gql/errors");
const decorators_1 = require("~/api/gql/decorators");
const types_1 = require("~/shared/types");
let LoginArgs = class LoginArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { description: 'Login' }),
    __metadata("design:type", String)
], LoginArgs.prototype, "login", void 0);
__decorate([
    type_graphql_1.Field(() => String, { description: 'Password' }),
    __metadata("design:type", String)
], LoginArgs.prototype, "password", void 0);
LoginArgs = __decorate([
    type_graphql_1.ArgsType()
], LoginArgs);
let UserQueriesResolver = class UserQueriesResolver {
    user(user) {
        return new structures_1.User(user);
    }
    login(args) {
        const { login, password } = args;
        const user = this.controller.getByLoginAndPassword(login, password);
        if (user === null) {
            throw new errors_1.UserNotFoundError();
        }
        return this.accessController.createDefaultUserToken(user.id);
    }
};
__decorate([
    typedi_1.Inject(() => controllers_1.UsersController),
    __metadata("design:type", controllers_1.UsersController)
], UserQueriesResolver.prototype, "controller", void 0);
__decorate([
    typedi_1.Inject(() => controllers_1.AccessController),
    __metadata("design:type", controllers_1.AccessController)
], UserQueriesResolver.prototype, "accessController", void 0);
__decorate([
    decorators_1.RequireScope(types_1.EAccessScope.ReadUserInfo),
    type_graphql_1.Query(() => structures_1.User, {
        description: 'Returns information about current user',
    }),
    __param(0, decorators_1.UseCurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", structures_1.User)
], UserQueriesResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Query(() => String, {
        description: 'Authenticates user and returns token with default ' +
            'access scopes'
    }),
    __param(0, type_graphql_1.Args(() => LoginArgs)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginArgs]),
    __metadata("design:returntype", String)
], UserQueriesResolver.prototype, "login", null);
UserQueriesResolver = __decorate([
    type_graphql_1.Resolver()
], UserQueriesResolver);
exports.UserQueriesResolver = UserQueriesResolver;

//# sourceMappingURL=UserQueriesResolver.js.map
