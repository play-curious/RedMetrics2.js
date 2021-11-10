import * as axios from "axios";
// todo start game session if gamesessionid not exists
export class Client {
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
