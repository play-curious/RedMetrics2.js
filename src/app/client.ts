import * as axios from "axios";
import * as types from "rm2-typings";
import { config } from "dotenv";

export interface GameSessionConfig {
  gameId: string;
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
  gameSession: GameSessionConfig;
  bufferingDelay?: number;
}

// todo start game session if gamesessionid not exists

export class Client {
  protected eventQueue: Set<
    Omit<types.tables.Event, "server_time" | "game_session_id">
  > = new Set();
  protected bufferingInterval: any = null;
  protected gameSessionId?: string;
  protected connected = false;
  protected api: axios.AxiosInstance;

  constructor(public readonly config: ClientConfig) {
    const axiosConfig: axios.AxiosRequestConfig = {
      params: { apikey: config.apiKey },
      baseURL: config.baseUrl,
    };

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

    const { data: session } = await this.api.get<
      types.api.Session["Get"]["Response"]
    >(`/session`);

    if (!session) {
      const gameSession: types.api.Session["Post"]["Body"] = {
        game_id: this.config.gameSession.gameId,
        version: this.config.gameSession.gameVersion,
        screen_size: this.config.gameSession.screenSize,
        software: this.config.gameSession.software,
        external_id: this.config.gameSession.externalId,
        platform: this.config.gameSession.platform,
        custom_data:
          this.config.gameSession.customData === undefined
            ? undefined
            : JSON.stringify(this.config.gameSession.customData),
      };

      const {
        data: { id: gameSessionId },
      } = await this.api.post<{ id: string }>(`/v2/game-session`, gameSession);

      this.gameSessionId = gameSessionId;
    } else {
      this.gameSessionId = session.id;
    }

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
