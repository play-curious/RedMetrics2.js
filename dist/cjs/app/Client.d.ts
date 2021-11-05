import * as axios from "axios";
import * as types from "rm2-typings";
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
export declare class Client {
    readonly config: ClientConfig;
    protected eventQueue: Omit<types.tables.Event, "server_time" | "session_id" | "id">[];
    protected bufferingInterval: any;
    protected gameSessionId?: string;
    protected connected: boolean;
    protected api: axios.AxiosInstance;
    constructor(config: ClientConfig);
    get isConnected(): boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    private buff;
    private sendEvent;
    emit(type: types.EventType, event: Omit<types.tables.Event, "user_time" | "type" | "server_time" | "id" | "game_session_id">): void;
}
