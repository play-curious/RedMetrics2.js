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
export declare type EmittedEvent = Omit<types.tables.Event, "user_time" | "type" | "server_time" | "id" | "session_id">;
export declare class Client {
    readonly config: ClientConfig;
    protected eventQueue: Omit<types.tables.Event, "server_time" | "session_id" | "id">[];
    protected bufferingInterval: any;
    protected sessionId?: string;
    protected connected: boolean;
    protected api: axios.AxiosInstance;
    constructor(config: ClientConfig);
    get isConnected(): boolean;
    connect(): Promise<void>;
    disconnect(emitted?: EmittedEvent): Promise<void>;
    private buff;
    private sendEvent;
    emit(type: types.EventType, event: EmittedEvent): void;
}
