"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EUserRole = exports.EAccessScope = void 0;
/**
 * List of access scopes which could be given to user.
 */
var EAccessScope;
(function (EAccessScope) {
    /**
     * Allows to read current user information.
     */
    EAccessScope["ReadUserInfo"] = "RegisterUser";
    /**
     * Allows to create new posts.
     */
    EAccessScope["CreatePost"] = "CreatePost";
})(EAccessScope = exports.EAccessScope || (exports.EAccessScope = {}));
/**
 * List of roles which could be assigned to user.
 */
var EUserRole;
(function (EUserRole) {
    EUserRole["Admin"] = "Admin";
    EUserRole["Moderator"] = "Moderator";
    EUserRole["Editor"] = "Editor";
    EUserRole["Common"] = "Common";
})(EUserRole = exports.EUserRole || (exports.EUserRole = {}));

//# sourceMappingURL=enums.js.map
