type Listener = (...args: any[]) => void;

type Listeners = Map<string, Array<Listener>>;

class MockSocket {
    public connected = false;
    private listeners: Listeners = new Map();

    constructor(public url: string, public opts: any) {
        queueMicrotask(() => {
            this.connected = true;
            this.emitEvent("connect");
        });
    }

    on(event: string, callback: Listener) {
        const current = this.listeners.get(event) ?? [];
        current.push(callback);
        this.listeners.set(event, current);
        return this;
    }

    once(event: string, callback: Listener) {
        const wrapper = (data: any) => {
            this.off(event, wrapper);
            callback(data);
        };
        return this.on(event, wrapper);
    }

    off(event: string, callback: Listener) {
        const current = this.listeners.get(event);
        if (!current) return this;
        this.listeners.set(event, current.filter(listener => listener !== callback));
        return this;
    }

    emit(event: string, data?: any) {
        if (event === "msg") {
            queueMicrotask(() => {
                if (!data || !data.text || !data.chat) {
                    this.emit("error", "Message is empty or some required arguments are missing");
                } else {
                    this.emit("message", {
                        id: 1,
                        text: data.text,
                        author_id: 1,
                        author_avatar: "image",
                        author: "author",
                        chat: data.chat,
                        sent_at: 1000,
                    });
                }
            });
            return this;
        }

        if (event === "getUserInfo") {
            queueMicrotask(() => {
                if (!data || (!data.id && !data.name)) {
                    this.emit("error", { msg: "No data provided" });
                    return;
                }
                if (data.name !== "user" && data.id !== 1) {
                    this.emit("error", { msg: "No such user" });
                    return;
                }
                this.emit("userInfo", {
                    user: { id: 1, name: "user", avatar: "image" },
                });
            });
            return this;
        }

        this.emitEvent(event, data);
        return this;
    }

    disconnect() {
        this.connected = false;
        this.emitEvent("disconnect");
    }

    private emitEvent(event: string, data?: any) {
        const callbacks = this.listeners.get(event);
        if (!callbacks) return;
        callbacks.slice().forEach(callback => callback(data));
    }
}

export function io(url: string, opts: any) {
    return new MockSocket(url, opts);
}

export type Socket = MockSocket;
