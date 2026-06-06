import { io, Socket } from "socket.io-client";
import { WebSocketEmitEvent, WebSocketEvent, WebSocketSubscribeOptions } from "./types";

export class Subscription {
    private id: number;
    public event: WebSocketEvent;
    public callback: (data: any) => void;
    private socket: WebSocketClient;

    constructor(id: number, socket: WebSocketClient, event: WebSocketEvent, callback: (data: any) => void) {
        this.id = id;
        this.socket = socket;
        this.event = event;
        this.callback = callback;
    }

    remove() {
        this.socket.removeSubscription(this.id);
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

    async waitForSocket(): Promise<void> {
        while (!this.socket) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    subscribe(event: WebSocketEvent, callback: (data: any) => void, options?: WebSocketSubscribeOptions): Subscription {
        const { once = false } = options ?? {};

        let newCallback: typeof callback;

        const id = this.lastSubscriptionId++;

        if (once) {
            const wrapper = (data: any) => {
                if (!this.subscriptions.has(id)) return;
                this.subscriptions.delete(id);
                callback(data);
            };
            newCallback = wrapper;
            this.waitForSocket().then(() => {
                if (this.socket) this.socket.once(event, wrapper);
            });
        } else {
            newCallback = callback;
            this.waitForSocket().then(() => {
                if (this.socket) this.socket.on(event, newCallback);
            });
        }

        const subscription = new Subscription(id, this, event, newCallback);
        this.subscriptions.set(id, subscription);

        return subscription;
    }

    removeSubscription(id: number): void {
        if (this.subscriptions.has(id)) {
            const subscription = this.subscriptions.get(id)!;
            this.subscriptions.delete(id);
            this.waitForSocket().then(() => {
                if (this.socket) this.socket.off(subscription.event, subscription.callback);
            });
        }
    }

    emit(event: WebSocketEmitEvent, data: any): void {
        this.waitForSocket().then(() => {
            if (this.socket) this.socket.emit(event, data);
        });
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
