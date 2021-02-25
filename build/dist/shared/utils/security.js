"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeUserJWT = exports.createUserJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typedi_1 = require("typedi");
const di_1 = require("~/shared/di");
const utils_1 = require("~/shared/utils");
const types_1 = require("~/shared/types");
const DAY_IN_S = 24 * 60 * 60;
const scopes = Object.values(types_1.EAccessScope);
/**
 * Creates JSON Web Token.
 * @param payload
 */
function createJWT(payload) {
    // Create JSON Web Token with duration of 1 day.
    return jsonwebtoken_1.default.sign(payload, typedi_1.Container.get(di_1.ConfigToken).jwtSecretKey, { expiresIn: DAY_IN_S });
}
/**
 * Creates user JWT.
 * @param payload
 */
function createUserJWT(payload) {
    return createJWT(payload);
}
exports.createUserJWT = createUserJWT;
/**
 * Validates JSON Web Token returning payload or false in case token is not
 * valid.
 * @param token
 */
function decodeJWT(token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, typedi_1.Container.get(di_1.ConfigToken).jwtSecretKey);
        if (!utils_1.isObject(payload)) {
            return null;
        }
        return payload;
    }
    catch (e) {
        return null;
    }
}
/**
 * Checks if value is user JWT payload.
 * @param value
 */
function isUserJWTPayload(value) {
    return utils_1.isObject(value) &&
        // id
        utils_1.isNumber(value.id) &&
        // scopes
        (utils_1.isArray(value.scopes) && value.scopes.every(s => {
            return utils_1.isString(s) && scopes.includes(s);
        }));
}
/**
 * Decodes token and returns payload in case it is user JWT payload.
 * @param token
 */
function decodeUserJWT(token) {
    const payload = decodeJWT(token);
    if (payload === null || !isUserJWTPayload(payload)) {
        return null;
    }
    return payload;
}
exports.decodeUserJWT = decodeUserJWT;

//# sourceMappingURL=security.js.map
