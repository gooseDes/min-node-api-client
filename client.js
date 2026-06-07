import { WebSocketClient } from "./websocket";
export class ApiClient {
    constructor(options) {
        this.url = options.url;
        this.socket = new WebSocketClient(this.url);
    }
    async jsonHttpRequest(endpoint, data) {
        const responce = await fetch(`${this.url}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await responce.json();
        if (responce.ok) {
            return { success: true, data: json };
        }
        else {
            return { success: false, message: json.msg };
        }
    }
    async httpRequest(endpoint, options) {
        const { token, body } = options !== null && options !== void 0 ? options : {};
        const responce = await fetch(`${this.url}/${endpoint}`, {
            method: "POST",
            ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
            body,
        });
        const json = await responce.json();
        if (responce.ok) {
            return { success: true, data: json };
        }
        else {
            return { success: false, message: json.msg };
        }
    }
    async login(email, password) {
        const response = await this.jsonHttpRequest("login", { email, password });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return {
            success: true,
            token: response.data.token,
            user: { id: response.data.id, email: email, username: response.data.username },
        };
    }
    async register(username, email, password) {
        const response = await this.jsonHttpRequest("register", { username, email, password });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return { success: true, token: response.data.token, user: { id: response.data.id, email, username } };
    }
    async verifyToken(token) {
        const response = await this.jsonHttpRequest("verify", { token });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return {
            success: true,
            is_valid: response.data.valid,
        };
    }
    async attachImage(token, image) {
        const formData = new FormData();
        if (image instanceof File) {
            formData.append("attachments", image);
        }
        else {
            /* @ts-ignore */
            formData.append("attachments", image);
        }
        const response = await this.httpRequest("attach", { body: formData, token });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return { success: true, urls: response.data.urls };
    }
    async uploadAvatar(token, image) {
        const formData = new FormData();
        if (image instanceof File) {
            formData.append("avatar", image);
        }
        else {
            /* @ts-ignore */
            formData.append("avatar", image);
        }
        const response = await this.httpRequest("upload-avatar", { body: formData, token });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return { success: true, url: response.data.url, avatar: response.data.avatar };
    }
    initSocket(token) {
        this.socket.init(token);
    }
    closeSocket() {
        this.socket.close();
    }
    resetSocket() {
        this.socket.reset();
    }
    /**
     * Requires socket
     */
    async getUserInfo(config) {
        return new Promise(resolve => {
            let successSub;
            let errorSub;
            const cleanup = () => {
                successSub.remove();
                errorSub.remove();
            };
            successSub = this.socket.subscribe("userInfo", data => {
                cleanup();
                resolve({ success: true, id: data.user.id, username: data.user.name, avatar: data.user.avatar });
            }, { once: true });
            errorSub = this.socket.subscribe("error", data => {
                cleanup();
                resolve({ success: false, message: data.msg });
            }, { once: true });
            this.socket.emit("getUserInfo", "username" in config ? { name: config.username } : { id: config.id });
        });
    }
}
