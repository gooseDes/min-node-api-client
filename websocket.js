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
        const isTestEnv = process.env.NODE_ENV === "test";
        this.socket = io(this.url, {
            auth: { token },
            ...(isTestEnv
                ? { transports: ["websocket"], reconnection: false, forceNew: true }
                : {}),
        });
        this.connectionPromise = new Promise((resolve, reject) => {
            this.resolveConnection = resolve;
            this.rejectConnection = reject;
        });
        this.socket.on("connect", () => {
            var _a;
            (_a = this.resolveConnection) === null || _a === void 0 ? void 0 : _a.call(this);
        });
        this.socket.on("connect_error", error => {
            var _a;
            (_a = this.rejectConnection) === null || _a === void 0 ? void 0 : _a.call(this, error);
        });
    }
    async waitForSocket() {
        while (!this.socket) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        if (!this.socket.connected) {
            await this.connectionPromise;
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
        this.connectionPromise = undefined;
        this.resolveConnection = undefined;
        this.rejectConnection = undefined;
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
        this.lastSubscriptionId = 0;
    }
}
