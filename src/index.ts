import * as types from "rm2-typings";

export interface ClientConfig {
  apiKey: string;
  session?: Partial<types.tables.Session>;
  bufferingDelay?: number;
  protocol?: string;
  host?: string;
  port?: string;
  /** The after-url path of targeted API (e.g: "/v2") */
  path?: string;
}

export type EmittedEvent = types.utils.SnakeToCamelCaseNested<
  Omit<types.tables.Event, "server_timestamp" | "id" | "session_id">
>;

export class WriteConnection {
  private _eventQueue: EmittedEvent[] = [];
  private _buffering = false;
  private _bufferingInterval: any = null;
  private _connected = false;
  private _api = types.utils.request;
  private _sessionId?: types.tables.Session["id"];

  constructor(private _config: ClientConfig) {
    types.utils.setupConfig({
      params: { apikey: _config.apiKey },
      baseURL: `${_config.protocol ?? "http"}://${
        _config.host ?? "localhost"
      }:${_config.port ?? 6627}${_config.path ?? "/"}`,
    });
  }

  get isConnected(): boolean {
    return this._connected;
  }

  get sessionId(): types.Id | undefined {
    return this._sessionId;
  }

  async connect(): Promise<void> {
    console.log("RM2: WriteConnection connecting...");

    if (this._connected) {
      console.warn("RM2: WriteConnection is already connected");
      return;
    }

    const apiKey = await this._api<types.api.Key>("Get", "/key", undefined);

    if (!apiKey) throw new Error("Invalid API key !");

    console.log("RM2: WriteConnection connected");

    const { data } = await this._api<types.api.Session>(
      "Post",
      "/session",
      this._config.session ? this._config.session : {}
    );

    this._sessionId = data.id;

    console.log("created session", this._sessionId);

    this._connected = true;

    this._bufferingInterval = setInterval(
      this.sendData.bind(this),
      this._config.bufferingDelay ?? 1000
    );
  }

  async disconnect(emitted?: EmittedEvent): Promise<void> {
    if (!this._connected) {
      console.warn("RM2: WriteConnection already disconnected");
      return;
    }

    clearInterval(this._bufferingInterval);

    this.postEvent({ ...emitted, type: "end" });

    await this.sendData();

    this._bufferingInterval = null;
    this._connected = false;
  }

  /**
   * Sends the current buffer of events, and return the number of events sent
   */
  async sendData(): Promise<number> {
    if (this._buffering || this._eventQueue.length === 0) return 0;

    if (!this._connected) {
      throw new Error("RM2: ❌ WriteConnection client not connected");
    }

    this._buffering = true;

    const eventData = this._eventQueue.map((event) => ({
      ...event,
      session_id: this._sessionId as string,
    }));

    console.log("RM2: WriteConnection sending events", eventData);

    try {
      await this._api<types.api.Event>("Post", "/event", eventData);

      this._eventQueue = [];

      eventData.length = 0;
    } catch (error) {
      if (/[45]\d{2}/.test(error.message)) {
        this._connected = false;

        console.error(error);

        throw new Error("RM2: ❌ WriteConnection connection crash");
      } else {
      }
    }

    this._buffering = false;
    return eventData.length;
  }

  /**
   * Add the given event to the buffer of events to be sent
   */
  postEvent(event: EmittedEvent): void {
    if (!event.userTimestamp) event.userTimestamp = new Date().toISOString();

    this._eventQueue.push(event);
  }

  async updateSession(session: Partial<types.tables.Session>): Promise<void> {
    this._config.session = session;

    // If not connected, return immediately
    if (!this._connected) return;

    console.log("RM2: WriteConnection updating session", session);

    // Otherwise, send update
    await this._api<types.api.SessionById>(
      "Put",
      `/session/${this._sessionId}`,
      session
    );
  }
}
