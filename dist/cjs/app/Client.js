"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const axios = __importStar(require("axios"));
// todo start game session if gamesessionid not exists
class Client {
    constructor(config) {
        this.config = config;
        this.eventQueue = [];
        this.bufferingInterval = null;
        this.connected = false;
        this.api = axios.default.create({
            params: { apikey: config.apiKey },
            baseURL: config.baseUrl,
            headers: { "Access-Control-Allow-Origin": config.baseUrl },
        });
    }
    get isConnected() {
        return this.connected;
    }
    async connect() {
        if (this.connected)
            throw new Error("RedMetrics client is already connected");
        const route = `/key`;
        const { data: apiKey } = await this.api.get(route);
        if (!apiKey) {
            const session = this.config.session
                ? {
                    version: this.config.session.gameVersion,
                    screen_size: this.config.session.screenSize,
                    software: this.config.session.software,
                    external_id: this.config.session.externalId,
                    platform: this.config.session.platform,
                    custom_data: this.config.session.customData === undefined
                        ? undefined
                        : JSON.stringify(this.config.session.customData),
                }
                : {};
            const sessionRoute = `/session`;
            const { data } = await this.api.post(sessionRoute, session);
            this.sessionId = data.id;
        }
        else
            this.sessionId = apiKey.key;
        this.connected = true;
        this.bufferingInterval = setInterval(this.buff.bind(this), this.config.bufferingDelay ?? 60000);
    }
    async disconnect(emitted) {
        if (!this.connected)
            throw new Error("RedMetrics client is not connected");
        clearInterval(this.bufferingInterval);
        this.emit("end", { ...emitted });
        await this.buff();
        this.bufferingInterval = null;
        this.connected = false;
    }
    /**
     * If you want to send events manually
     */
    async buff() {
        if (this.connected && this.eventQueue.length > 0) {
            const events = this.eventQueue.map((event) => ({
                ...event,
                session_id: this.sessionId,
            }));
            const eventRoute = "/event";
            await this.api.post(eventRoute, events).then((res) => {
                if (res.status == 200)
                    this.eventQueue = [];
            });
            return true;
        }
        else if (!this.connected)
            console.error("❌ redmetrics client not connected");
        return false;
    }
    emit(type, event) {
        this.eventQueue.push({
            ...event,
            type,
            user_time: new Date().toISOString(),
        });
    }
}
exports.Client = Client;
module.exports = Client;
