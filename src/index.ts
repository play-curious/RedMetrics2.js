import * as types from "rm2-typings";

export interface ClientConfig {
  apiKey: string;
  baseUrl: string;
  session?: types.tables.Session;
  bufferingDelay?: number;
}

export type EmittedEvent = Omit<
  types.tables.Event,
  "user_time" | "type" | "server_time" | "id" | "session_id"
>;

// todo start game session if gamesessionid not exists

export default class Client {
  protected eventQueue: Omit<
    types.tables.Event,
    "server_time" | "session_id" | "id"
  >[] = [];
  protected bufferingInterval: any = null;
  protected sessionId?: string;
  protected connected = false;
  protected api = types.utils.request;

  constructor(public readonly config: ClientConfig) {
    types.utils.setupConfig({
      params: { apikey: config.apiKey },
      baseURL: config.baseUrl,
      headers: { "Access-Control-Allow-Origin": config.baseUrl },
    });
  }

  get isConnected(): boolean {
    return this.connected;
  }

  public async connect(): Promise<void> {
    console.log("connexion...");

    if (this.connected)
      throw new Error("RedMetrics client is already connected");

    const apiKey = await this.api<types.api.Key>("Get", "/key", undefined);

    if (!apiKey) throw new Error("Invalid API key !");

    this.sessionId = apiKey.key;

    console.log("connected with " + apiKey.game_id + " game id");

    const sessions = await this.api<types.api.GameById_Sessions>(
      "Get",
      `/game/${apiKey.game_id}/sessions`,
      undefined
    );

    const data = await this.api<types.api.Session>(
      "Post",
      "/session",
      this.config.session ? this.config.session : {}
    );

    this.sessionId = data.id;
    console.log("created session", this.sessionId);

    this.connected = true;

    this.bufferingInterval = setInterval(
      this.buff.bind(this),
      this.config.bufferingDelay ?? 60000
    );
  }

  public async disconnect(emitted?: EmittedEvent): Promise<void> {
    if (!this.connected) throw new Error("RedMetrics client is not connected");

    clearInterval(this.bufferingInterval);

    this.emit("end", { ...emitted });

    await this.buff();

    this.bufferingInterval = null;
    this.connected = false;
  }

  /**
   * If you want to send events manually
   */
  async buff(): Promise<boolean> {
    if (this.connected && this.eventQueue.length > 0) {
      const eventData = this.eventQueue.map((event) => ({
        ...event,
        session_id: this.sessionId as string,
      }));

      console.log("sending events", eventData);

      await this.api<types.api.Event>("Post", "/event", eventData).then(
        (res) => {
          if (res.status == 200) this.eventQueue = [];
        }
      );

      return true;
    } else if (!this.connected)
      console.error("❌ redmetrics client not connected");

    return false;
  }

  public emit(type: types.EventType, event: EmittedEvent) {
    this.eventQueue.push({
      ...event,
      type,
      user_time: new Date().toISOString(),
    });
  }
}

module.exports = Client;
