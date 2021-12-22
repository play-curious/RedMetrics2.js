import * as types from "rm2-typings";
export interface ClientConfig {
    apiKey: string;
    baseUrl: string;
    session?: Partial<types.tables.Session>;
    bufferingDelay?: number;
}
export declare type EmittedEvent = Omit<types.tables.Event, "server_time" | "id" | "session_id">;
export declare class WriteConnection {
    private _config;
    private _eventQueue;
    private _bufferingInterval;
    private _connected;
    private _api;
    private _sessionId?;
    constructor(_config: ClientConfig);
    get isConnected(): boolean;
    get sessionId(): types.Id | undefined;
    connect(): Promise<void>;
    disconnect(emitted?: EmittedEvent): Promise<void>;
    /**
     * Sends the current buffer of events, and return the number of events sent
     */
    sendData(): Promise<number>;
    /**
     * Add the given event to the buffer of events to be sent
     */
    postEvent(event: EmittedEvent): void;
    postEvent(type: string, event: Omit<EmittedEvent, "type">): void;
    updateSession(session: Partial<types.tables.Session>): Promise<void>;
}
