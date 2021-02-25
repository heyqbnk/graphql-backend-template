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
exports.PostMutationsResolver = void 0;
const type_graphql_1 = require("type-graphql");
const structures_1 = require("~/api/gql/structures");
const decorators_1 = require("~/api/gql/decorators");
const types_1 = require("~/shared/types");
const class_validator_1 = require("class-validator");
const typedi_1 = require("typedi");
const controllers_1 = require("~/shared/controllers");
let CreatePostArgs = class CreatePostArgs {
};
__decorate([
    class_validator_1.MinLength(3),
    class_validator_1.MaxLength(300),
    type_graphql_1.Field(() => String, { description: 'Title' }),
    __metadata("design:type", String)
], CreatePostArgs.prototype, "title", void 0);
__decorate([
    class_validator_1.MinLength(100),
    class_validator_1.MaxLength(1000),
    type_graphql_1.Field(() => String, { description: 'Content' }),
    __metadata("design:type", String)
], CreatePostArgs.prototype, "content", void 0);
CreatePostArgs = __decorate([
    type_graphql_1.ArgsType()
], CreatePostArgs);
let PostMutationsResolver = class PostMutationsResolver {
    createPost(user, args) {
        const { title, content } = args;
        const post = this.controller.create({ title, content, userId: user.id });
        return new structures_1.Post(post);
    }
    deletePost(user, postId) {
        return this.controller.delete(postId, user.id);
    }
};
__decorate([
    typedi_1.Inject(() => controllers_1.PostsController),
    __metadata("design:type", controllers_1.PostsController)
], PostMutationsResolver.prototype, "controller", void 0);
__decorate([
    decorators_1.RequireScope(types_1.EAccessScope.CreatePost),
    type_graphql_1.Mutation(() => structures_1.Post, {
        description: 'Creates new user post'
    }),
    __param(0, decorators_1.UseCurrentUser()),
    __param(1, type_graphql_1.Args(() => CreatePostArgs)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreatePostArgs]),
    __metadata("design:returntype", structures_1.Post)
], PostMutationsResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => structures_1.Post),
    __param(0, decorators_1.UseCurrentUser()),
    __param(1, type_graphql_1.Arg('postId', () => type_graphql_1.Int, {
        description: 'Post identifier'
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Boolean)
], PostMutationsResolver.prototype, "deletePost", null);
PostMutationsResolver = __decorate([
    type_graphql_1.Resolver()
], PostMutationsResolver);
exports.PostMutationsResolver = PostMutationsResolver;

//# sourceMappingURL=PostMutationsResolver.js.map
