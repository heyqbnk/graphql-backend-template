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
exports.PostsController = void 0;
const typedi_1 = require("typedi");
const UsersController_1 = require("~/shared/controllers/UsersController");
let PostsController = class PostsController {
    constructor() {
        this.posts = [{
                id: 0,
                userId: 0,
                title: 'First admin post',
                content: 'Lorem ipsum dolor sit amet',
                createdAt: new Date(),
            }];
    }
    /**
     * Returns user posts.
     * @param userId
     */
    getUserPosts(userId) {
        return this.posts.filter(p => p.userId === userId && !('deletedAt' in p));
    }
    /**
     * Returns post by id.
     * @param id
     */
    getById(id) {
        return this.posts.find(p => p.id === id) || null;
    }
    /**
     * Creates new post.
     * @param data
     */
    create(data) {
        const { content, title, userId } = data;
        if (!this.usersController.isRegistered(userId)) {
            throw new Error('User was not found');
        }
        this.posts.push({
            id: this.posts.length,
            userId,
            title,
            content,
            createdAt: new Date(),
        });
        return this.posts[this.posts.length - 1];
    }
    /**
     * Deletes post with soft deletion.
     * @param id
     * @param userId
     */
    delete(id, userId) {
        for (const post of this.posts) {
            if (post.id === id) {
                if (post.userId !== userId) {
                    return false;
                }
                if ('deletedAt' in post) {
                    return false;
                }
                post.deletedAt = new Date();
                return true;
            }
        }
        return false;
    }
};
__decorate([
    typedi_1.Inject(() => UsersController_1.UsersController),
    __metadata("design:type", UsersController_1.UsersController)
], PostsController.prototype, "usersController", void 0);
PostsController = __decorate([
    typedi_1.Service()
], PostsController);
exports.PostsController = PostsController;

//# sourceMappingURL=PostsController.js.map
