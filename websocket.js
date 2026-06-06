import { io } from "socket.io-client";
export class Subscription {
    constructor(id, subscriptions, socket, event, callback) {
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
    constructor(url) {
        this.subscriptions = new Map();
        this.lastSubscriptionId = 0;
        this.url = url;
    }
    init(token) {
        this.socket = io(this.url, { auth: { token } });
    }
    subscribe(event, callback, options) {
        const { once = false } = options !== null && options !== void 0 ? options : {};
        if (!this.socket) {
            throw new Error("Socket is not initialized yet");
        }
        let newCallback;
        const id = this.lastSubscriptionId++;
        if (once) {
            const wrapper = (data) => {
                if (!this.subscriptions.has(id))
                    return;
                this.subscriptions.delete(id);
                callback(data);
            };
            newCallback = wrapper;
            this.socket.once(event, wrapper);
        }
        else {
            newCallback = callback;
            this.socket.on(event, newCallback);
        }
        const subscription = new Subscription(id, this.subscriptions, this.socket, event, newCallback);
        this.subscriptions.set(id, subscription);
        return subscription;
    }
    emit(event, data) {
        if (!this.socket) {
            throw new Error("Socket is not initialized yet");
        }
        this.socket.emit(event, data);
    }
    close() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
    reset() {
        for (const subscription of this.subscriptions.values()) {
            subscription.remove();
        }
        try {
            this.close();
        }
        catch (e) {
            console.error("WebSocketClient: error during disconnect", e);
        }
        this.socket = undefined;
        this.subscriptions.clear();
        this.lastSubscriptionId = -1;
    }
}
