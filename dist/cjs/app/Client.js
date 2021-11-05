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
        });
        this.connect()
            .then(() => console.log("✔ redmetrics client connected"))
            .catch((error) => {
            console.error("❌ redmetrics client not connected");
            console.error(error);
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
            const session = {
                version: this.config.gameSession.gameVersion,
                screen_size: this.config.gameSession.screenSize,
                software: this.config.gameSession.software,
                external_id: this.config.gameSession.externalId,
                platform: this.config.gameSession.platform,
                custom_data: this.config.gameSession.customData === undefined
                    ? undefined
                    : JSON.stringify(this.config.gameSession.customData),
            };
            const { data } = await this.api.post(`/v2/session`, session);
            this.gameSessionId = data;
        }
        else {
            this.gameSessionId = apiKey.key;
        }
        this.connected = true;
        this.bufferingInterval = setInterval(this.buff.bind(this), this.config.bufferingDelay ?? 60000);
    }
    async disconnect() {
        if (!this.connected)
            throw new Error("RedMetrics client is not connected");
        clearInterval(this.bufferingInterval);
        await this.buff();
        this.bufferingInterval = null;
        this.connected = false;
    }
    async buff() {
        if (this.connected && this.eventQueue.length > 0)
            await Promise.all(Array.from(this.eventQueue).map(this.sendEvent.bind(this)));
        else
            return Promise.resolve();
    }
    async sendEvent(event) {
        if (!this.gameSessionId)
            throw new Error("The game session is not created: internal error...");
        await this.api
            .post("/v2/event", { ...event, game_session_id: this.gameSessionId })
            .then(() => {
            console.info(`emitted event: [${event.type}]`);
            this.eventQueue.splice(this.eventQueue.indexOf(event), 1);
        });
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
