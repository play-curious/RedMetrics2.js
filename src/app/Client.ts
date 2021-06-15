import * as axios from "axios";
import * as types from "rm2-typings";

export interface ApiConfig {
  protocol: string;
  host: string;
  port?: number | string;
  route?: string;
}

export interface GameSessionConfig {
  gameVersionId: string;
  customData?: object;
  externalId?: string;
  platform?: string;
  screenSize?: string;
  software?: string;
}

export interface ClientConfig {
  apiKey: string;
  apiConfig?: ApiConfig;
  bufferingDelay?: number;
  gameSession?: GameSessionConfig;
}

export const defaultApiConfig: ApiConfig = {
  protocol: "https",
  host: "api.redmetrics.io",
};

export const defaultDevConfig: ApiConfig = {
  protocol: "http",
  host: "localhost",
  port: "6627",
};

// todo start game session if gamesessionid not exists

export class Client {
  protected eventQueue: Set<
    Omit<types.RMEvent, "server_time" | "game_session_id">
  > = new Set();
  protected bufferingInterval: any = null;
  protected gameSessionId?: string;
  protected connected = false;
  protected session?: types.Session;
  protected db: axios.AxiosInstance;

  constructor(public readonly config: ClientConfig) {
    const { protocol, port, host } = config.apiConfig ?? defaultApiConfig;

    const axiosConfig: axios.AxiosRequestConfig = {
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

  get isConnected(): boolean {
    return this.connected;
  }

  public async connect(): Promise<void> {
    if (this.connected)
      throw new Error("RedMetrics client is already connected");

    const { data: session } = await this.db.get<types.Session>(`/v2/session`);

    if (session.game_id) {
      if (!this.config.gameSession?.gameVersionId) {
        throw new Error(
          [
            "You linked a game to your API key but you did not enter the game version.",
            "Please define the `gameSession.gameVersionId` key from the client config.",
          ].join(" ")
        );
      }

      const gameSession: types.GameSession = {
        game_version_id: this.config.gameSession.gameVersionId,
        screen_size: this.config.gameSession.screenSize,
        software: this.config.gameSession.software,
        external_id: this.config.gameSession.externalId,
        platform: this.config.gameSession.platform,
        custom_data: this.config.gameSession.customData,
      };

      const {
        data: { id: gameSessionId },
      } = await this.db.post<{ id: string }>(`/v2/game-session`, gameSession);

      this.gameSessionId = gameSessionId;
    }

    this.session = session;
    this.connected = true;

    this.bufferingInterval = setInterval(
      this.buff.bind(this),
      this.config.bufferingDelay ?? 60000
    );
  }

  public async disconnect(): Promise<void> {
    if (!this.connected) throw new Error("RedMetrics client is not connected");

    clearInterval(this.bufferingInterval);

    await this.buff();

    this.bufferingInterval = null;
    this.connected = false;
  }

  private async buff(): Promise<void> {
    if (this.connected && this.eventQueue.size > 0)
      await Promise.all(
        Array.from(this.eventQueue).map(this.sendEvent.bind(this))
      );
    else return Promise.resolve();
  }

  private async sendEvent(
    event: Omit<types.RMEvent, "server_time" | "id" | "game_session_id">
  ) {
    if (!this.gameSessionId)
      throw new Error("The game session is not created: internal error...");

    await this.db
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
