import * as types from "rm2-typings";

export interface ClientConfig {
  apiKey: string;
  baseUrl: string;
  session?: Partial<types.tables.Session>;
  bufferingDelay?: number;
}

export type EmittedEvent = Omit<
  types.tables.Event,
  "server_time" | "id" | "session_id"
>;

export class WriteConnection {
  private _config: ClientConfig;
  private _eventQueue: Omit<
    types.tables.Event,
    "server_time" | "session_id" | "id"
  >[] = [];
  private _bufferingInterval: any = null;
  private _connected = false;
  private _api = types.utils.request;
  private _sessionId?: types.Id;

  constructor(_config: ClientConfig) {
    this._config = _config;
    types.utils.setupConfig({
      params: { apikey: _config.apiKey },
      baseURL: _config.baseUrl,
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

    const data = await this._api<types.api.Session>(
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

    this.postEvent("end", { ...emitted });

    await this.sendData();

    this._bufferingInterval = null;
    this._connected = false;
  }

  /**
   * Sends the current buffer of events, and return the number of events sent
   */
  async sendData(): Promise<number> {
    if (!this._connected) {
      throw new Error("RM2: ❌ WriteConnection client not connected");
    }

    if (this._eventQueue.length === 0) {
      return 0;
    }

    const eventData = this._eventQueue.map((event) => ({
      ...event,
      session_id: this._sessionId as string,
    }));

    console.log("RM2: WriteConnection sending events", eventData);

    await this._api<types.api.Event>("Post", "/event", eventData).then(() => {
      this._eventQueue = [];
    });

    return eventData.length;
  }

  /**
   * Add the given event to the buffer of events to be sent
   */
  postEvent(event: EmittedEvent): void;
  postEvent(type: string, event: Omit<EmittedEvent, "type">): void;
  postEvent(
    typeOrEvent: EmittedEvent | string,
    event?: Omit<EmittedEvent, "type">
  ): void {
    let eventToPost: EmittedEvent;
    if (typeof typeOrEvent === "string") {
      eventToPost = { type: typeOrEvent };
    } else {
      eventToPost = typeOrEvent;
    }

    if (!eventToPost.user_time)
      eventToPost.user_time = new Date().toISOString();

    this._eventQueue.push(eventToPost);
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
