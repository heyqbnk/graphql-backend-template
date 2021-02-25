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
const types_1 = require("~/shared/types");
const decorators_1 = require("~/api/gql/decorators");
const controllers_1 = require("~/shared/controllers");
const typedi_1 = require("typedi");
const errors_1 = require("~/api/gql/errors");
let SetUserRoleArgs = class SetUserRoleArgs {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { description: 'User identifier' }),
    __metadata("design:type", Number)
], SetUserRoleArgs.prototype, "userId", void 0);
__decorate([
    type_graphql_1.Field(() => types_1.EUserRole, { description: 'Assigned role' }),
    __metadata("design:type", String)
], SetUserRoleArgs.prototype, "role", void 0);
SetUserRoleArgs = __decorate([
    type_graphql_1.ArgsType()
], SetUserRoleArgs);
let UserMutationsResolver = class UserMutationsResolver {
    setUserRole(user, args) {
        const { role, userId } = args;
        // Moderator cannot set admin or moderator role to someone.
        if (user.role === types_1.EUserRole.Moderator &&
            [types_1.EUserRole.Admin, types_1.EUserRole.Moderator].includes(role)) {
            throw new errors_1.ForbiddenError();
        }
        const updatedUser = this.controller.setUserRole(userId, role);
        if (updatedUser === null) {
            throw new errors_1.UserNotFoundError();
        }
        return new structures_1.User(updatedUser);
    }
};
__decorate([
    typedi_1.Inject(() => controllers_1.UsersController),
    __metadata("design:type", controllers_1.UsersController)
], UserMutationsResolver.prototype, "controller", void 0);
__decorate([
    decorators_1.RequireRole({ oneOf: [types_1.EUserRole.Moderator, types_1.EUserRole.Admin] }),
    type_graphql_1.Mutation(() => structures_1.User, {
        description: 'Changes user role',
    }),
    __param(0, decorators_1.UseCurrentUser()),
    __param(1, type_graphql_1.Args(() => SetUserRoleArgs)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SetUserRoleArgs]),
    __metadata("design:returntype", structures_1.User)
], UserMutationsResolver.prototype, "setUserRole", null);
UserMutationsResolver = __decorate([
    type_graphql_1.Resolver()
], UserMutationsResolver);
exports.UserMutationsResolver = UserMutationsResolver;

//# sourceMappingURL=UserMutationsResolver.js.map
