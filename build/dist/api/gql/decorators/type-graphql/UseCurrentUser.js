"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCurrentUser = void 0;
const type_graphql_1 = require("type-graphql");
const errors_1 = require("~/api/gql/errors");
const typedi_1 = require("typedi");
const controllers_1 = require("~/shared/controllers");
/**
 * Возвращает текущего пользователя в случае, если он зарегистрирован.
 * @returns {ParameterDecorator}
 * @constructor
 */
function UseCurrentUser() {
    return type_graphql_1.createParamDecorator(async ({ context }) => {
        if (!('user' in context)) {
            throw new errors_1.UserNotFoundError();
        }
        const usersController = typedi_1.Container.get(controllers_1.UsersController);
        const user = usersController.getById(context.user.id);
        if (!user) {
            throw new errors_1.UserNotFoundError();
        }
        return user;
    });
}
exports.UseCurrentUser = UseCurrentUser;

//# sourceMappingURL=UseCurrentUser.js.map
