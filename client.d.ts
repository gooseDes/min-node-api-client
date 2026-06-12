import { ApiClientOptions, AttachImageResult, CreateChatConfig, CreateChatResult, DeleteMessageConfig, DeleteMessageResult, FetchChatMessagesConfig, FetchChatMessagesResult, FetchChatsResult, FetchMessageInfoConfig, FetchMessageInfoResult, FetchUserInfoConfig, FetchUserInfoResult, HttpRequestOptions, Image, JsonHttpRequestResult, LinkFcmTokenConfig, LinkFcmTokenResult, LoginResult, MessageDataWithSender, SendMessageConfig, SendMessageResult, UploadAvatarResult, VerifyTokenResult } from "./types";
import { Subscription, WebSocketClient } from "./websocket";
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
    private socketFetchBase;
    private socketFetchBaseNoError;
    /**
     * Requires socket
     */
    fetchUser(config: FetchUserInfoConfig): Promise<FetchUserInfoResult>;
    /**
     * Requires socket
     */
    fetchMessage(config: FetchMessageInfoConfig): Promise<FetchMessageInfoResult>;
    /**
     * Requires socket
     */
    fetchChats(): Promise<FetchChatsResult>;
    /**
     * Requires socket
     */
    fetchChatMessages(config: FetchChatMessagesConfig): Promise<FetchChatMessagesResult>;
    /**
     * Requires socket
     */
    createChat(config: CreateChatConfig): Promise<CreateChatResult>;
    /**
     * Requires socket
     */
    sendMessage(config: SendMessageConfig): Promise<SendMessageResult>;
    /**
     * Requires socket
     */
    deleteMessage(config: DeleteMessageConfig): Promise<DeleteMessageResult>;
    /**
     * Requires socket
     */
    linkFcmToken(config: LinkFcmTokenConfig): Promise<LinkFcmTokenResult>;
    /**
     * Requires socket
     */
    subscribeToMessages(callback: (message: MessageDataWithSender) => void): Subscription;
    /**
     * Requires socket
     */
    subscribeToDeletingMessages(callback: (id: number) => void): Subscription;
}
