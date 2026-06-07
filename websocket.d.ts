import { WebSocketEmitEvent, WebSocketEvent, WebSocketSubscribeOptions } from "./types";
export declare class Subscription {
    private id;
    event: WebSocketEvent;
    callback: (data: any) => void;
    private socket;
    constructor(id: number, socket: WebSocketClient, event: WebSocketEvent, callback: (data: any) => void);
    remove(): void;
}
export declare class WebSocketClient {
    private socket;
    private url;
    subscriptions: Map<number, Subscription>;
    private lastSubscriptionId;
    private connectionPromise;
    private resolveConnection;
    private rejectConnection;
    constructor(url: string);
    init(token: string): void;
    waitForSocket(): Promise<void>;
    subscribe(event: WebSocketEvent, callback: (data: any) => void, options?: WebSocketSubscribeOptions): Subscription;
    removeSubscription(id: number): void;
    emit(event: WebSocketEmitEvent, data: any): void;
    close(): void;
    reset(): void;
}
