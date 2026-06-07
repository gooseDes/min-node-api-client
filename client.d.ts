import { ApiClientOptions, AttachImageResult, GetUserInfoConfig, GetUserInfoResult, HttpRequestOptions, Image, JsonHttpRequestResult, LoginResult, UploadAvatarResult, VerifyTokenResult } from "./types";
import { WebSocketClient } from "./websocket";
export declare class ApiClient {
    private url;
    socket: WebSocketClient;
    constructor(options: ApiClientOptions);
    jsonHttpRequest(endpoint: string, data: any): Promise<JsonHttpRequestResult>;
    httpRequest(endpoint: string, options?: HttpRequestOptions): Promise<JsonHttpRequestResult>;
    login(email: string, password: string): Promise<LoginResult>;
    register(username: string, email: string, password: string): Promise<LoginResult>;
    verifyToken(token: string): Promise<VerifyTokenResult>;
    attachImage(token: string, image: Image): Promise<AttachImageResult>;
    uploadAvatar(token: string, image: Image): Promise<UploadAvatarResult>;
    initSocket(token: string): void;
    closeSocket(): void;
    resetSocket(): void;
    /**
     * Requires socket
     */
    getUserInfo(config: GetUserInfoConfig): Promise<GetUserInfoResult>;
}
