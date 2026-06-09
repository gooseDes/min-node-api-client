import {
    ApiClientOptions,
    AttachImageResult,
    FetchChatMessagesConfig,
    FetchChatMessagesResult,
    FetchChatsResult,
    FetchMessageInfoConfig,
    FetchMessageInfoResult,
    FetchUserInfoConfig,
    FetchUserInfoResult,
    HttpRequestOptions,
    Image,
    JsonHttpRequestResult,
    LoginResult,
    UploadAvatarResult,
    VerifyTokenResult,
    WebSocketEmitEvent,
    WebSocketEvent,
} from "./types";
import { toDate } from "./utils";
import { Subscription, WebSocketClient } from "./websocket";

export class ApiClient {
    private url: string;
    public socket: WebSocketClient;

    constructor(options: ApiClientOptions) {
        this.url = options.url;
        this.socket = new WebSocketClient(this.url);
    }

    async jsonHttpRequest(endpoint: string, data: any): Promise<JsonHttpRequestResult> {
        const response = await fetch(`${this.url}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await response.json();
        if (response.ok) {
            return { success: true, data: json };
        } else {
            return { success: false, message: json.msg };
        }
    }

    async httpRequest(endpoint: string, options?: HttpRequestOptions): Promise<JsonHttpRequestResult> {
        const { token, body } = options ?? {};
        const response = await fetch(`${this.url}/${endpoint}`, {
            method: "POST",
            ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
            body,
        });
        const json = await response.json();
        if (response.ok) {
            return { success: true, data: json };
        } else {
            return { success: false, message: json.msg };
        }
    }

    async login(email: string, password: string): Promise<LoginResult> {
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

    async register(username: string, email: string, password: string): Promise<LoginResult> {
        const response = await this.jsonHttpRequest("register", { username, email, password });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return { success: true, token: response.data.token, user: { id: response.data.id, email, username } };
    }

    async verifyToken(token: string): Promise<VerifyTokenResult> {
        const response = await this.jsonHttpRequest("verify", { token });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return {
            success: true,
            is_valid: response.data.valid,
        };
    }

    async attachImage(token: string, image: Image): Promise<AttachImageResult> {
        const formData = new FormData();
        if (image instanceof File) {
            formData.append("attachments", image);
        } else {
            /* @ts-ignore */
            formData.append("attachments", image);
        }
        const response = await this.httpRequest("attach", { body: formData, token });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return { success: true, urls: response.data.urls };
    }

    async uploadAvatar(token: string, image: Image): Promise<UploadAvatarResult> {
        const formData = new FormData();
        if (image instanceof File) {
            formData.append("avatar", image);
        } else {
            /* @ts-ignore */
            formData.append("avatar", image);
        }
        const response = await this.httpRequest("upload-avatar", { body: formData, token });
        if (!response.success) {
            return { success: false, message: response.message };
        }
        return { success: true, url: response.data.url, avatar: response.data.avatar };
    }

    initSocket(token: string) {
        this.socket.init(token);
    }

    closeSocket() {
        this.socket.close();
    }

    resetSocket() {
        this.socket.reset();
    }

    private socketFetchBase(
        emitEvent: WebSocketEmitEvent,
        event: WebSocketEvent,
        data: any,
        successCallback: (data: any) => void,
        errorCallback: (data: any) => void,
    ): void {
        let successSub: Subscription;
        let errorSub: Subscription;

        const cleanup = () => {
            successSub.remove();
            errorSub.remove();
        };

        successSub = this.socket.subscribe(
            event,
            data => {
                cleanup();
                successCallback(data);
            },
            { once: true },
        );

        errorSub = this.socket.subscribe(
            "error",
            data => {
                cleanup();
                errorCallback(data);
            },
            { once: true },
        );

        this.socket.emit(emitEvent, data);
    }

    /**
     * Requires socket
     */
    async fetchUser(config: FetchUserInfoConfig): Promise<FetchUserInfoResult> {
        return new Promise<FetchUserInfoResult>(resolve => {
            this.socketFetchBase(
                "getUserInfo",
                "userInfo",
                "username" in config ? { name: config.username } : { id: config.id },
                data =>
                    resolve({ success: true, user: { id: data.user.id, username: data.user.name, avatar: data.user.avatar } }),
                data => resolve({ success: false, message: data.msg }),
            );
        });
    }

    /**
     * Requires socket
     */
    async fetchMessage(config: FetchMessageInfoConfig): Promise<FetchMessageInfoResult> {
        return new Promise<FetchMessageInfoResult>(resolve => {
            this.socketFetchBase(
                "getMessage",
                "requestedMessage",
                { messageId: config.id },
                data =>
                    resolve({
                        success: true,
                        message: {
                            id: data.message.id,
                            content: data.message.content,
                            senderId: data.message.senderId,
                            chatId: data.message.chatId,
                            sentAt: toDate(data.message.sentAt),
                            isSeen: data.message.seen,
                            seenAt: toDate(data.message.seenAt),
                        },
                    }),
                data => resolve({ success: false, message: data.msg }),
            );
        });
    }

    /**
     * Requires socket
     */
    async fetchChats(): Promise<FetchChatsResult> {
        return new Promise<FetchChatsResult>(resolve => {
            this.socketFetchBase(
                "getChats",
                "chats",
                {},
                data => resolve({ success: true, chats: data.chats }),
                data => resolve({ success: false, message: data.msg }),
            );
        });
    }

    /**
     * Requires socket
     */
    async fetchChatMessages(config: FetchChatMessagesConfig): Promise<FetchChatMessagesResult> {
        return new Promise<FetchChatMessagesResult>(resolve => {
            this.socketFetchBase(
                "getChatHistory",
                "history",
                { chat: config.id },
                data =>
                    resolve({
                        success: true,
                        messages: data.messages.map((m: any) => ({
                            id: m.id,
                            chatId: m.chat_id,
                            senderId: m.author_id,
                            content: m.text,
                            sentAt: toDate(m.sent_at),
                            isSeen: m.seen,
                            seenAt: toDate(m.seen_at),
                            sender: {
                                id: m.author_id,
                                username: m.author,
                                avatar: m.author_avatar,
                            },
                        })),
                    }),
                data => resolve({ success: false, message: data.msg }),
            );
        });
    }
}
