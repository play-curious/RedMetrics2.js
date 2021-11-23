import * as types from "rm2-typings";
export interface ClientConfig {
    apiKey: string;
    baseUrl: string;
    session?: types.tables.Session;
    bufferingDelay?: number;
}
export declare type EmittedEvent = Omit<types.tables.Event, "user_time" | "type" | "server_time" | "id" | "session_id">;
export default class Client {
    readonly config: ClientConfig;
    protected eventQueue: Omit<types.tables.Event, "server_time" | "session_id" | "id">[];
    protected bufferingInterval: any;
    protected sessionId?: string;
    protected connected: boolean;
    protected api: typeof types.utils.request;
    constructor(config: ClientConfig);
    get isConnected(): boolean;
    connect(): Promise<void>;
    disconnect(emitted?: EmittedEvent): Promise<void>;
    /**
     * If you want to send events manually
     */
    buff(): Promise<boolean>;
    emit(type: types.EventType, event: EmittedEvent): void;
}
