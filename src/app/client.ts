import * as axios from "axios";
import * as types from "rm2-typings";

export interface ApiConfig {
  protocol: string;
  host: string;
  port?: number | string;
  route?: string;
}

export interface GameSessionConfig {
  gameVersionId?: string;
  customData?: object;
  externalId?: string;
  platform?: string;
  screenSize?: string;
  software?: string;
}

export interface ClientConfig {
  apiKey: string;
  gameId: string;
  apiConfig?: ApiConfig;
  bufferingDelay?: number;
  gameSession?: GameSessionConfig;
}

export const defaultApiConfig: ApiConfig = {
  protocol: "https",
  host: "api.redmetrics.io",
  port: 443,
};

export class Client {
  protected eventQueue: Set<
    Omit<types.RMEvent, "server_time" | "game_session_id">
  > = new Set();
  protected bufferingInterval: any = null;
  protected connected = false;
  protected api: axios.AxiosInstance;
  protected gameSessionId?: string;

  constructor(public readonly config: ClientConfig) {
    const protocol = config.apiConfig?.protocol || defaultApiConfig.protocol;
    const host = config.apiConfig?.host || defaultApiConfig.host;
    const port = config.apiConfig?.port;

    const axiosConfig: axios.AxiosRequestConfig = {
      params: { apikey: config.apiKey },
      baseURL: `${protocol}://${host}${port ? `:${port}` : ""}`,
    };

    console.log(`Created RedMetrics client for ${axiosConfig.baseURL}`);

    this.api = axios.default.create(axiosConfig);

    this.connect()
      .then(() => console.log("✔ redmetrics client connected"))
      .catch((error) => {
        console.error("❌ redmetrics client not connected");
        console.error(error, axiosConfig);
      });
  }

  get isConnected(): boolean {
    return this.connected;
  }

  public async connect(): Promise<void> {
    if (this.connected)
      throw new Error("RedMetrics client is already connected");

    const gameSession: types.Session = {
      // TODO: a game version should not be required
      game_version_id: this.config.gameSession?.gameVersionId || "",

      screen_size: this.config.gameSession?.screenSize,
      software: this.config.gameSession?.software,
      external_id: this.config.gameSession?.externalId,
      platform: this.config.gameSession?.platform,
      custom_data: this.config.gameSession?.customData,
    };

    // TODO: creating a session should not require a game id
    const gameSessionData = {
      game_id: this.config.gameId,
      ...gameSession,
    };

    console.log("posting gameSessionData", gameSessionData);

    const {
      data: { id: gameSessionId },
    } = await this.api.post<{ id: string }>(`/v2/session`, gameSessionData);

    this.gameSessionId = gameSessionId;

    this.connected = true;

    this.bufferingInterval = setInterval(
      this.buff.bind(this),
      this.config.bufferingDelay ?? 60000
    );
  }

  public async disconnect(): Promise<void> {
    if (!this.connected) throw new Error("RedMetrics client is not connected");

    console.log("Disconnecting...");
    clearInterval(this.bufferingInterval);

    await this.buff();

    console.log("Disconnected...");

    this.bufferingInterval = null;
    this.connected = false;
  }

  private async buff(): Promise<void> {
    if (this.connected && this.eventQueue.size > 0) {
      console.log(`Sending ${this.eventQueue.size} events`);
      await Promise.all(
        Array.from(this.eventQueue).map(this.sendEvent.bind(this))
      );
    } else {
      return Promise.resolve();
    }
  }

  private async sendEvent(
    event: Omit<types.RMEvent, "server_time" | "id" | "game_session_id">
  ) {
    if (!this.gameSessionId)
      throw new Error("The game session is not created: internal error...");

    await this.api
      .post("/v2/event", { ...event, game_session_id: this.gameSessionId })
      .then(() => {
        console.info(`emitted event: [${event.type}]`);
        this.eventQueue.delete(event);
      });
  }

  public emit(
    type: types.RMEvent["type"],
    event: Omit<
      types.RMEvent,
      "user_time" | "type" | "server_time" | "id" | "game_session_id"
    >
  ) {
    this.eventQueue.add({
      ...event,
      type,
      user_time: new Date().toISOString(),
    });
  }
}
