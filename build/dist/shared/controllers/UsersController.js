"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const types_1 = require("~/shared/types");
const typedi_1 = require("typedi");
let UsersController = class UsersController {
    constructor() {
        this.users = [{
                id: 0,
                firstName: 'admin',
                login: 'admin',
                password: 'admin',
                role: types_1.EUserRole.Admin,
            }];
    }
    /**
     * Register new user.
     * @param options
     */
    register(options) {
        const { firstName, lastName, login, password } = options;
        const loweredLogin = login.toLowerCase();
        const isRegistered = this.users.some(u => {
            return u.login.toLowerCase() === loweredLogin;
        });
        if (isRegistered) {
            throw new Error('User is already registered');
        }
        this.users.push({
            id: this.users.length,
            firstName,
            lastName,
            login,
            password,
            role: types_1.EUserRole.Common,
        });
        return this.users[this.users.length - 1];
    }
    /**
     * Returns user by login and password.
     * @param login
     * @param password
     */
    getByLoginAndPassword(login, password) {
        return this
            .users
            .find(u => u.login === login && u.password === password) || null;
    }
    /**
     * Returns user by id.
     * @param id
     */
    getById(id) {
        return this
            .users
            .find(u => u.id === id) || null;
    }
    /**
     * Checks if user is registered.
     * @param id
     */
    isRegistered(id) {
        return this.users.some(u => u.id === id);
    }
    /**
     * Updates user role.
     * @param id
     * @param role
     */
    setUserRole(id, role) {
        for (const user of this.users) {
            if (user.id === id) {
                if (user.role === role) {
                    return user;
                }
                user.role = role;
                return user;
            }
        }
        return null;
    }
};
UsersController = __decorate([
    typedi_1.Service()
], UsersController);
exports.UsersController = UsersController;

//# sourceMappingURL=UsersController.js.map
