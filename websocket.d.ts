import { Socket } from "socket.io-client";
import { WebSocketEmitEvent, WebSocketEvent, WebSocketSubscribeOptions } from "./types";
export declare class Subscription {
    private event;
    private callback;
    private socket;
    constructor(socket: Socket, event: WebSocketEvent, callback: (data: any) => void);
    unsubscribe(): void;
}
export declare class WebSocketClient {
    private socket;
    private url;
    constructor(url: string);
    init(token: string): void;
    subscribe(event: WebSocketEvent, callback: (data: any) => void, options?: WebSocketSubscribeOptions): Subscription;
    emit(event: WebSocketEmitEvent, data: any): void;
    close(): void;
    reset(): void;
}
