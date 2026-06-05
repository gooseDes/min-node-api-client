import { io, Socket } from "socket.io-client";
import { WebSocketEmitEvent, WebSocketEvent, WebSocketSubscribeOptions } from "./types";

export class Subscription {
    private event: WebSocketEvent;
    private callback: (data: any) => void;
    private socket: Socket;

    constructor(socket: Socket, event: WebSocketEvent, callback: (data: any) => void) {
        this.socket = socket;
        this.event = event;
        this.callback = callback;
    }

    unsubscribe() {
        this.socket.off(this.event, this.callback);
    }
}

export class WebSocketClient {
    private socket: Socket | undefined;
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    init(token: string): void {
        this.socket = io(this.url, { auth: { token } });
    }

    subscribe(event: WebSocketEvent, callback: (data: any) => void, options?: WebSocketSubscribeOptions): Subscription {
        const { once = false } = options ?? {};

        if (!this.socket) {
            throw new Error("Socket is not initialized yet");
        }

        if (once) {
            this.socket.once(event, callback);
        } else {
            this.socket.on(event, callback);
        }
        return new Subscription(this.socket, event, callback);
    }

    emit(event: WebSocketEmitEvent, data: any): void {
        if (!this.socket) {
            throw new Error("Socket is not initialized yet");
        }
        this.socket.emit(event, data);
    }

    close(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
