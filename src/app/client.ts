import * as axios from "axios";
import * as types from "rm2-typings";

export interface SessionInfo {
  gameId?: string;
  gameVersion?: string;
  customData?: object;
  externalId?: string;
  platform?: string;
  screenSize?: string;
  software?: string;
}

export interface ClientConfig {
  apiKey: string;
  baseUrl: string;
  session?: SessionInfo;
  bufferingDelay?: number;
}

export type EmittedEvent = Omit<
  types.tables.Event,
  "user_time" | "type" | "server_time" | "id" | "session_id"
>;

// todo start game session if gamesessionid not exists

export class Client {
  protected eventQueue: Omit<
    types.tables.Event,
    "server_time" | "session_id" | "id"
  >[] = [];
  protected bufferingInterval: any = null;
  protected sessionId?: string;
  protected connected = false;
  protected api: axios.AxiosInstance;

  constructor(public readonly config: ClientConfig) {
    this.api = axios.default.create({
      params: { apikey: config.apiKey },
      baseURL: config.baseUrl,
      headers: { "Access-Control-Allow-Origin": config.baseUrl },
    });

    this.connect()
      .then(() => console.log("✔ redmetrics client connected"))
      .catch((error) => {
        console.error("❌ redmetrics client not connected");
        console.error(error);
      });
  }

  get isConnected(): boolean {
    return this.connected;
  }

  public async connect(): Promise<void> {
    if (this.connected)
      throw new Error("RedMetrics client is already connected");

    const route: types.api.Key["Route"] = `/key`;
    const { data: apiKey } = await this.api.get<
      types.api.Key["Get"]["Response"]
    >(route);

    if (!apiKey) {
      const session: types.api.Session["Post"]["Body"] = this.config.session
        ? {
            version: this.config.session.gameVersion,
            screen_size: this.config.session.screenSize,
            software: this.config.session.software,
            external_id: this.config.session.externalId,
            platform: this.config.session.platform,
            custom_data:
              this.config.session.customData === undefined
                ? undefined
                : JSON.stringify(this.config.session.customData),
          }
        : {};

      const { data } = await this.api.post(`/v2/session`, session);

      this.sessionId = data;
    } else {
      this.sessionId = apiKey.key;
    }

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

  private async buff(): Promise<void> {
    if (this.connected && this.eventQueue.length > 0)
      await Promise.all(
        Array.from(this.eventQueue).map(this.sendEvent.bind(this))
      );
    else return Promise.resolve();
  }

  private async sendEvent(
    event: Omit<types.tables.Event, "server_time" | "id" | "session_id">
  ) {
    if (!this.sessionId)
      throw new Error("The game session is not created: internal error...");

    await this.api
      .post("/v2/event", { ...event, game_session_id: this.sessionId })
      .then(() => {
        console.info(`emitted event: [${event.type}]`);
        this.eventQueue.splice(this.eventQueue.indexOf(event), 1);
      });
  }

  public emit(type: types.EventType, event: EmittedEvent) {
    this.eventQueue.push({
      ...event,
      type,
      user_time: new Date().toISOString(),
    });
  }
}
