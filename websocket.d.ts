import { Socket } from "socket.io-client";
import { WebSocketEmitEvent, WebSocketEvent, WebSocketSubscribeOptions } from "./types";
export declare class Subscription {
    private id;
    private subscriptions;
    private event;
    private callback;
    private socket;
    constructor(id: number, subscriptions: Map<number, Subscription>, socket: Socket, event: WebSocketEvent, callback: (data: any) => void);
    remove(): void;
}
export declare class WebSocketClient {
    private socket;
    private url;
    subscriptions: Map<number, Subscription>;
    private lastSubscriptionId;
    constructor(url: string);
    init(token: string): void;
    subscribe(event: WebSocketEvent, callback: (data: any) => void, options?: WebSocketSubscribeOptions): Subscription;
    emit(event: WebSocketEmitEvent, data: any): void;
    close(): void;
    reset(): void;
}
