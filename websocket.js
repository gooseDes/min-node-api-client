import { io } from "socket.io-client";
export class Subscription {
    constructor(socket, event, callback) {
        this.socket = socket;
        this.event = event;
        this.callback = callback;
    }
    unsubscribe() {
        this.socket.off(this.event, this.callback);
    }
}
export class WebSocketClient {
    constructor(url) {
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
        if (once) {
            this.socket.once(event, callback);
        }
        else {
            this.socket.on(event, callback);
        }
        return new Subscription(this.socket, event, callback);
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
        try {
            this.close();
        }
        catch { }
        this.socket = undefined;
    }
}
