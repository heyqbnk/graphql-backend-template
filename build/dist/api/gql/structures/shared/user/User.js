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
exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const structures_1 = require("~/api/gql/structures");
let User = class User {
    constructor(user) {
        const { lastName, id, firstName } = user;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { description: 'Unique identifier' }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String, { description: 'First name' }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    type_graphql_1.Field(() => String, { description: 'Last name', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastName", void 0);
__decorate([
    type_graphql_1.Field(() => [structures_1.Post], { description: 'User posts count', defaultValue: [] }),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
User = __decorate([
    type_graphql_1.ObjectType({ description: 'User information' }),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;

//# sourceMappingURL=User.js.map
