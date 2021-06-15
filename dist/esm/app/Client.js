import * as axios from "axios";
export const defaultApiConfig = {
    protocol: "https",
    host: "api.redmetrics.io",
};
export const defaultDevConfig = {
    protocol: "http",
    host: "localhost",
    port: "6627",
};
// todo start game session if gamesessionid not exists
export class Client {
    constructor(config) {
        this.config = config;
        this.eventQueue = new Set();
        this.bufferingInterval = null;
        this.connected = false;
        const { protocol, port, host } = config.apiConfig ?? defaultApiConfig;
        const axiosConfig = {
            params: { apikey: config.apiKey },
            baseURL: `${protocol}://${host}${port ? `:${port}` : ""}`,
        };
        this.db = axios.default.create(axiosConfig);
        this.connect()
            .then(() => console.log("✔ redmetrics client connected"))
            .catch((error) => {
            console.error("❌ redmetrics client not connected");
            console.error(error, axiosConfig);
        });
    }
    get isConnected() {
        return this.connected;
    }
    async connect() {
        if (this.connected)
            throw new Error("RedMetrics client is already connected");
        const { data: session } = await this.db.get(`/v2/session`);
        if (session.game_id) {
            if (!this.config.gameSession?.gameVersionId) {
                throw new Error([
                    "You linked a game to your API key but you did not enter the game version.",
                    "Please define the `gameSession.gameVersionId` key from the client config.",
                ].join(" "));
            }
            const gameSession = {
                game_version_id: this.config.gameSession.gameVersionId,
                screen_size: this.config.gameSession.screenSize,
                software: this.config.gameSession.software,
                external_id: this.config.gameSession.externalId,
                platform: this.config.gameSession.platform,
                custom_data: this.config.gameSession.customData,
            };
            const { data: { id: gameSessionId }, } = await this.db.post(`/v2/game-session`, gameSession);
            this.gameSessionId = gameSessionId;
        }
        this.session = session;
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
        if (this.connected && this.eventQueue.size > 0)
            await Promise.all(Array.from(this.eventQueue).map(this.sendEvent.bind(this)));
        else
            return Promise.resolve();
    }
    async sendEvent(event) {
        if (!this.gameSessionId)
            throw new Error("The game session is not created: internal error...");
        await this.db
            .post("/v2/event", { ...event, game_session_id: this.gameSessionId })
            .then(() => {
            console.info(`emitted event: [${event.type}]`);
            this.eventQueue.delete(event);
        });
    }
    emit(type, event) {
        this.eventQueue.add({
            ...event,
            type,
            user_time: new Date().toISOString(),
        });
    }
}