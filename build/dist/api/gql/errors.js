"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIsAlreadyRegisteredError = exports.UserNotFoundError = exports.UnknownError = exports.MissingScopeError = exports.ForbiddenError = exports.BadParametersError = exports.AuthorizationError = void 0;
const utils_1 = require("./utils");
const types_1 = require("./types");
exports.AuthorizationError = utils_1.createError(types_1.EApolloErrors.Authorization, 'Authorization required');
exports.BadParametersError = utils_1.createError(types_1.EApolloErrors.BadParameters, 'Плохие параметры');
exports.ForbiddenError = utils_1.createError(types_1.EApolloErrors.Forbidden, 'Access denied');
exports.MissingScopeError = utils_1.createError(types_1.EApolloErrors.MissingScope, 'Required scope is missing');
exports.UnknownError = utils_1.createError(types_1.EApolloErrors.Unknown, 'Произошла неизвестная ошибка');
exports.UserNotFoundError = utils_1.createError(types_1.EApolloErrors.UserNotFound, 'User was not found');
exports.UserIsAlreadyRegisteredError = utils_1.createError(types_1.EApolloErrors.UserIsAlreadyRegistered, 'User is already registered');

//# sourceMappingURL=errors.js.map
