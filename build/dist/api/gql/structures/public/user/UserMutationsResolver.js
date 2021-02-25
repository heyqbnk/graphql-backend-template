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
exports.UserMutationsResolver = void 0;
const type_graphql_1 = require("type-graphql");
const structures_1 = require("~/api/gql/structures");
const class_validator_1 = require("class-validator");
const typedi_1 = require("typedi");
const controllers_1 = require("~/shared/controllers");
const errors_1 = require("~/api/gql/errors");
let RegisterArgs = class RegisterArgs {
};
__decorate([
    class_validator_1.MinLength(1),
    class_validator_1.MaxLength(30),
    type_graphql_1.Field(() => String, { description: 'First name' }),
    __metadata("design:type", String)
], RegisterArgs.prototype, "firstName", void 0);
__decorate([
    class_validator_1.MinLength(1),
    class_validator_1.MaxLength(30),
    type_graphql_1.Field(() => String, { description: 'Last name', nullable: true }),
    __metadata("design:type", Object)
], RegisterArgs.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsAlphanumeric(),
    class_validator_1.MinLength(3),
    class_validator_1.MaxLength(32),
    type_graphql_1.Field(() => String, { description: 'Login' }),
    __metadata("design:type", String)
], RegisterArgs.prototype, "login", void 0);
__decorate([
    class_validator_1.MinLength(3),
    class_validator_1.MaxLength(100),
    type_graphql_1.Field(() => String, { description: 'Password' }),
    __metadata("design:type", String)
], RegisterArgs.prototype, "password", void 0);
RegisterArgs = __decorate([
    type_graphql_1.ArgsType()
], RegisterArgs);
let RegisterResult = class RegisterResult {
    constructor(user, token) {
        this.user = user;
        this.token = token;
    }
};
__decorate([
    type_graphql_1.Field(() => structures_1.User, { description: 'User information' }),
    __metadata("design:type", structures_1.User)
], RegisterResult.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String, { description: 'Access token' }),
    __metadata("design:type", String)
], RegisterResult.prototype, "token", void 0);
RegisterResult = __decorate([
    type_graphql_1.ObjectType(),
    __metadata("design:paramtypes", [structures_1.User, String])
], RegisterResult);
let UserMutationsResolver = class UserMutationsResolver {
    register(arg) {
        const { firstName, lastName, login, password } = arg;
        try {
            const user = this.controller.register({
                firstName,
                lastName: lastName || undefined,
                login,
                password,
            });
            const token = this
                .accessController
                .createDefaultUserToken(user.id);
            return new RegisterResult(new structures_1.User(user), token);
        }
        catch (e) {
            throw new errors_1.UserIsAlreadyRegisteredError();
        }
    }
};
__decorate([
    typedi_1.Inject(() => controllers_1.UsersController),
    __metadata("design:type", controllers_1.UsersController)
], UserMutationsResolver.prototype, "controller", void 0);
__decorate([
    typedi_1.Inject(() => controllers_1.AccessController),
    __metadata("design:type", controllers_1.AccessController)
], UserMutationsResolver.prototype, "accessController", void 0);
__decorate([
    type_graphql_1.Mutation(() => RegisterResult),
    __param(0, type_graphql_1.Args(() => RegisterArgs)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterArgs]),
    __metadata("design:returntype", RegisterResult)
], UserMutationsResolver.prototype, "register", null);
UserMutationsResolver = __decorate([
    type_graphql_1.Resolver()
], UserMutationsResolver);
exports.UserMutationsResolver = UserMutationsResolver;

//# sourceMappingURL=UserMutationsResolver.js.map
