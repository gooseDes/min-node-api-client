import { io } from "socket.io-client";
export class Subscription {
    constructor(id, socket, event, callback) {
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
    constructor(url) {
        this.subscriptions = new Map();
        this.lastSubscriptionId = 0;
        this.url = url;
    }
    init(token) {
        this.socket = io(this.url, { auth: { token } });
    }
    async waitForSocket() {
        while (!this.socket) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
    subscribe(event, callback, options) {
        const { once = false } = options !== null && options !== void 0 ? options : {};
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
            this.waitForSocket().then(() => {
                if (this.socket)
                    this.socket.once(event, wrapper);
            });
        }
        else {
            newCallback = callback;
            this.waitForSocket().then(() => {
                if (this.socket)
                    this.socket.on(event, newCallback);
            });
        }
        const subscription = new Subscription(id, this, event, newCallback);
        this.subscriptions.set(id, subscription);
        return subscription;
    }
    removeSubscription(id) {
        if (this.subscriptions.has(id)) {
            const subscription = this.subscriptions.get(id);
            this.subscriptions.delete(id);
            this.waitForSocket().then(() => {
                if (this.socket)
                    this.socket.off(subscription.event, subscription.callback);
            });
        }
    }
    emit(event, data) {
        this.waitForSocket().then(() => {
            if (this.socket)
                this.socket.emit(event, data);
        });
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
