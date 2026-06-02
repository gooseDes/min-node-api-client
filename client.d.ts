import { ApiClientOptions, AttachImageResult, HttpRequestOptions, Image, JsonHttpRequestResult, LoginResult, UploadAvatarResult, VerifyTokenResult } from "./types";
export declare class ApiClient {
    private url;
    constructor(options: ApiClientOptions);
    jsonHttpRequest(endpoint: string, data: any): Promise<JsonHttpRequestResult>;
    httpRequest(endpoint: string, options?: HttpRequestOptions): Promise<JsonHttpRequestResult>;
    login(email: string, password: string): Promise<LoginResult>;
    register(username: string, email: string, password: string): Promise<LoginResult>;
    verifyToken(token: string): Promise<VerifyTokenResult>;
    attachImage(token: string, image: Image): Promise<AttachImageResult>;
    uploadAvatar(token: string, image: Image): Promise<UploadAvatarResult>;
}
