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

      const sessionRoute: types.api.Session["Route"] = `/session`;

      const { data } = await this.api.post<
        types.api.Session["Post"]["Response"]
      >(sessionRoute, session);

      this.sessionId = data.id;
    } else this.sessionId = apiKey.key;

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
      const events: types.api.Event["Post"]["Body"] = this.eventQueue.map(
        (event) => ({
          ...event,
          session_id: this.sessionId as string,
        })
      );

      const eventRoute: types.api.Event["Route"] = "/event";

      await this.api.post(eventRoute, events).then((res) => {
        if (res.status == 200) this.eventQueue = [];
      });

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

module.exports.Client = Client;
