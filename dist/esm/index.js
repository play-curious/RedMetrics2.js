import * as types from "rm2-typings";
class WriteConnection {
  constructor(_config) {
    this._eventQueue = [];
    this._bufferingInterval = null;
    this._connected = false;
    this._api = types.utils.request;
    this._config = _config;
    types.utils.setupConfig({
      params: { apikey: _config.apiKey },
      baseURL: _config.baseUrl
    });
  }
  get isConnected() {
    return this._connected;
  }
  get sessionId() {
    return this._sessionId;
  }
  async connect() {
    console.log("RM2: WriteConnection connecting...");
    if (this._connected) {
      console.warn("RM2: WriteConnection is already connected");
      return;
    }
    const apiKey = await this._api("Get", "/key", void 0);
    if (!apiKey)
      throw new Error("Invalid API key !");
    console.log("RM2: WriteConnection connected");
    const data = await this._api("Post", "/session", this._config.session ? this._config.session : {});
    this._sessionId = data.id;
    console.log("created session", this._sessionId);
    this._connected = true;
    this._bufferingInterval = setInterval(this.sendData.bind(this), this._config.bufferingDelay ?? 1e3);
  }
  async disconnect(emitted) {
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
  async sendData() {
    if (!this._connected) {
      throw new Error("RM2: \u274C WriteConnection client not connected");
    }
    if (this._eventQueue.length === 0) {
      return 0;
    }
    const eventData = this._eventQueue.map((event) => ({
      ...event,
      session_id: this._sessionId
    }));
    console.log("RM2: WriteConnection sending events", eventData);
    await this._api("Post", "/event", eventData).then(() => {
      this._eventQueue = [];
    });
    return eventData.length;
  }
  postEvent(typeOrEvent, event) {
    let eventToPost;
    if (typeof typeOrEvent === "string") {
      eventToPost = { type: typeOrEvent };
    } else {
      eventToPost = typeOrEvent;
    }
    if (!eventToPost.user_time)
      eventToPost.user_time = new Date().toISOString();
    this._eventQueue.push(eventToPost);
  }
  async updateSession(session) {
    this._config.session = session;
    if (!this._connected)
      return;
    console.log("RM2: WriteConnection updating session", session);
    await this._api("Put", `/session/${this._sessionId}`, session);
  }
}
export {
  WriteConnection
};
