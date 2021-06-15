import * as axios from "axios";
import * as types from "rm2-typings/src/index";
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
export declare const defaultApiConfig: ApiConfig;
export declare const defaultDevConfig: ApiConfig;
export declare class Client {
    readonly config: ClientConfig;
    protected eventQueue: Set<Omit<types.RMEvent, "server_time" | "game_session_id">>;
    protected bufferingInterval: any;
    protected gameSessionId?: string;
    protected connected: boolean;
    protected session?: types.Session;
    protected db: axios.AxiosInstance;
    constructor(config: ClientConfig);
    get isConnected(): boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    private buff;
    private sendEvent;
    emit(type: types.RMEvent["type"], event: Omit<types.RMEvent, "user_time" | "type" | "server_time" | "id" | "game_session_id">): void;
}
