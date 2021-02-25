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
exports.PubSub = exports.PubSubProvider = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
const cluster_1 = require("cluster");
const utils_1 = require("~/shared/utils");
const typedi_1 = require("typedi");
function isPubSubMessage(value) {
    return utils_1.isObject(value) &&
        value.type === 'PubSubMessage' &&
        utils_1.isString(value.triggerName);
}
/**
 * Multi cluster provider for PubSub.
 */
class PubSubProvider {
    init() {
        if (!cluster_1.isMaster) {
            throw new Error('Unable to create PubSubProvider not in main thread');
        }
        const workersArray = Object.values(cluster_1.workers).filter(w => !utils_1.isUndefined(w));
        workersArray.forEach(w => {
            if (!utils_1.isUndefined(w)) {
                // Listen to each threads requests for events publication. In case,
                // request was received, it is required to notify all the threads about
                // they should do it.
                w.on('message', async (message) => {
                    if (isPubSubMessage(message) && !utils_1.isUndefined(process.send)) {
                        workersArray.forEach(w => w.send(message));
                    }
                });
            }
        });
    }
}
exports.PubSubProvider = PubSubProvider;
/**
 * Custom PubSub.
 */
let PubSub = class PubSub extends graphql_subscriptions_1.PubSub {
    constructor(props) {
        super(props);
        // Post event in case currently it is worker thread and event was received.
        if (cluster_1.isWorker) {
            cluster_1.worker.on('message', async (message) => {
                if (isPubSubMessage(message)) {
                    await super.publish(message.triggerName, message.payload);
                }
            });
        }
    }
    async publish(triggerName, payload) {
        // In case, we are in multi cluster mode, just notify all threads about it,
        // so they publish event.
        if (cluster_1.isWorker) {
            // При публикации события не забываем уведомить остальные потоки.
            const message = {
                type: 'PubSubMessage',
                triggerName,
                payload,
            };
            cluster_1.worker.send(message);
            return;
        }
        // Otherwise, just publish event.
        return super.publish(triggerName, payload);
    }
};
PubSub = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [Object])
], PubSub);
exports.PubSub = PubSub;

//# sourceMappingURL=PubSub.js.map
