import * as types from "rm2-typings";
// todo start game session if gamesessionid not exists
export default class Client {
    constructor(config) {
        this.config = config;
        this.eventQueue = [];
        this.bufferingInterval = null;
        this.connected = false;
        this.api = types.utils.request;
        types.utils.setupConfig({
            params: { apikey: config.apiKey },
            baseURL: config.baseUrl,
            headers: { "Access-Control-Allow-Origin": config.baseUrl },
        });
    }
    get isConnected() {
        return this.connected;
    }
    async connect() {
        console.log("connexion...");
        if (this.connected)
            throw new Error("RedMetrics client is already connected");
        const apiKey = await this.api("Get", "/key", undefined);
        if (!apiKey)
            throw new Error("Invalid API key !");
        this.sessionId = apiKey.key;
        console.log("connected with " + apiKey.game_id + " game id");
        const sessions = await this.api("Get", `/game/${apiKey.game_id}/sessions`, undefined);
        const data = await this.api("Post", "/session", this.config.session ? this.config.session : {});
        this.sessionId = data.id;
        console.log("created session", this.sessionId);
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
            const eventData = this.eventQueue.map((event) => ({
                ...event,
                session_id: this.sessionId,
            }));
            console.log("sending events", eventData);
            await this.api("Post", "/event", eventData).then((res) => {
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
module.exports = Client;
