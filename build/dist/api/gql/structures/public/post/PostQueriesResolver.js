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
exports.PostQueriesResolver = void 0;
const type_graphql_1 = require("type-graphql");
const structures_1 = require("~/api/gql/structures");
const typedi_1 = require("typedi");
const controllers_1 = require("~/shared/controllers");
let PostQueriesResolver = class PostQueriesResolver {
    post(postId) {
        const post = this.controller.getById(postId);
        if (post === null) {
            return null;
        }
        return new structures_1.Post(post);
    }
};
__decorate([
    typedi_1.Inject(() => controllers_1.PostsController),
    __metadata("design:type", controllers_1.PostsController)
], PostQueriesResolver.prototype, "controller", void 0);
__decorate([
    type_graphql_1.Query(() => structures_1.Post, {
        description: 'Returns post by id',
        nullable: true
    }),
    __param(0, type_graphql_1.Arg('postId', () => type_graphql_1.Int, { description: 'Post identifier' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], PostQueriesResolver.prototype, "post", null);
PostQueriesResolver = __decorate([
    type_graphql_1.Resolver()
], PostQueriesResolver);
exports.PostQueriesResolver = PostQueriesResolver;

//# sourceMappingURL=PostQueriesResolver.js.map
