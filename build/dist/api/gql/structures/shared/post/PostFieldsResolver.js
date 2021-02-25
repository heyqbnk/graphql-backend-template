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
exports.PostFieldsResolver = void 0;
const type_graphql_1 = require("type-graphql");
const structures_1 = require("~/api/gql/structures");
const controllers_1 = require("~/shared/controllers");
const typedi_1 = require("typedi");
const errors_1 = require("~/api/gql/errors");
let PostFieldsResolver = class PostFieldsResolver {
    user(post) {
        const user = this.usersController.getById(post.userId);
        if (user === null) {
            throw new errors_1.UserNotFoundError();
        }
        return new structures_1.User(user);
    }
};
__decorate([
    typedi_1.Inject(() => controllers_1.UsersController),
    __metadata("design:type", controllers_1.UsersController)
], PostFieldsResolver.prototype, "usersController", void 0);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [structures_1.Post]),
    __metadata("design:returntype", void 0)
], PostFieldsResolver.prototype, "user", null);
PostFieldsResolver = __decorate([
    type_graphql_1.Resolver(() => structures_1.Post)
], PostFieldsResolver);
exports.PostFieldsResolver = PostFieldsResolver;

//# sourceMappingURL=PostFieldsResolver.js.map
