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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const type_graphql_1 = require("type-graphql");
const structures_1 = require("~/api/gql/structures");
let Post = class Post {
    constructor(post) {
        const { userId, createdAt, content, title } = post;
        this.userId = userId;
        this.createdAt = createdAt;
        this.content = content;
        this.title = title;
    }
};
__decorate([
    type_graphql_1.Field(() => structures_1.User, { description: 'Post owner' }),
    __metadata("design:type", structures_1.User)
], Post.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String, { description: 'Title' }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { description: 'Content' }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { description: 'Creation date' }),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
Post = __decorate([
    type_graphql_1.ObjectType({ description: 'Post' }),
    __metadata("design:paramtypes", [Object])
], Post);
exports.Post = Post;

//# sourceMappingURL=Post.js.map
