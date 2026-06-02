import {
    ApiClientOptions,
    AttachImageResult,
    HttpRequestOptions,
    Image,
    JsonHttpRequestResult,
    LoginResult,
    UploadAvatarResult,
    VerifyTokenResult,
} from "./types";

export class ApiClient {
    private url: string;

    constructor(options: ApiClientOptions) {
        this.url = options.url;
    }

    async jsonHttpRequest(endpoint: string, data: any): Promise<JsonHttpRequestResult> {
        const responce = await fetch(`${this.url}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const json = await responce.json();
        if (responce.ok) {
            return { success: true, data: json };
        } else {
            return { success: false, message: json.msg };
        }
    }

    async httpRequest(endpoint: string, options?: HttpRequestOptions): Promise<JsonHttpRequestResult> {
        const { token, body } = options ?? {};
        const responce = await fetch(`${this.url}/${endpoint}`, {
            method: "POST",
            ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
            body,
        });
        const json = await responce.json();
        if (responce.ok) {
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
}
