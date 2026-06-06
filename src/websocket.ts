import { io, Socket } from "socket.io-client";
import { WebSocketEmitEvent, WebSocketEvent, WebSocketSubscribeOptions } from "./types";

export class Subscription {
    private id: number;
    private subscriptions: Map<number, Subscription>;
    private event: WebSocketEvent;
    private callback: (data: any) => void;
    private socket: Socket;

    constructor(
        id: number,
        subscriptions: Map<number, Subscription>,
        socket: Socket,
        event: WebSocketEvent,
        callback: (data: any) => void,
    ) {
        this.id = id;
        this.subscriptions = subscriptions;
        this.socket = socket;
        this.event = event;
        this.callback = callback;
    }

    remove() {
        this.socket.off(this.event, this.callback);
        this.subscriptions.delete(this.id);
    }
}

export class WebSocketClient {
    private socket: Socket | undefined;
    private url: string;
    public subscriptions = new Map<number, Subscription>();
    private lastSubscriptionId: number = 0;

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

        let newCallback: typeof callback;

        const id = this.lastSubscriptionId++;

        if (once) {
            const wrapper = (data: any) => {
                if (!this.subscriptions.has(id)) return;
                this.subscriptions.delete(id);
                callback(data);
            };
            newCallback = wrapper;
            this.socket.once(event, wrapper);
        } else {
            newCallback = callback;
            this.socket.on(event, newCallback);
        }

        const subscription = new Subscription(id, this.subscriptions, this.socket, event, newCallback);
        this.subscriptions.set(id, subscription);

        return subscription;
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

    reset(): void {
        for (const subscription of this.subscriptions.values()) {
            subscription.remove();
        }

        try {
            this.close();
        } catch (e) {
            console.error("WebSocketClient: error during disconnect", e);
        }

        this.socket = undefined;
        this.subscriptions.clear();
        this.lastSubscriptionId = -1;
    }
}
