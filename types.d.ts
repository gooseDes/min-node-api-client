export interface ApiClientOptions {
    url: string;
}
export interface AuthUserData {
    id: number;
    username: string;
    email: string;
}
export interface UserData {
    id: number;
    username: string;
    avatar: string;
}
export type RNFile = {
    uri: string;
    name: string;
    type: string;
};
export type Image = RNFile | File;
export type Failed = {
    success: false;
    message: string;
};
export type HttpRequestOptions = {
    token?: string;
    body?: any;
};
export type LoginResult = Failed | {
    success: true;
    token: string;
    user: AuthUserData;
};
export type VerifyTokenResult = Failed | {
    success: true;
    is_valid: boolean;
};
export type JsonHttpRequestResult = Failed | {
    success: true;
    data: any;
};
export type AttachImageResult = Failed | {
    success: true;
    urls: string[];
};
export type UploadAvatarResult = Failed | {
    success: true;
    url: string;
    avatar: string;
};
export type WebSocketEvent = "connect" | "disconnect" | "connect_error" | "error" | "message" | "deleteMessage" | "history" | "username" | "createChatResult" | "chats" | "userInfo" | "getChatWithResult" | "customEmojis" | "joinedVoice" | "turnUrls" | "requestedMessage";
export type WebSocketEmitEvent = "msg" | "getChatHistory" | "getName" | "createChat" | "getChats" | "getUserInfo" | "getChatWith" | "getCustomEmojis" | "seenAll" | "deleteMessage" | "joinVoice" | "voiceAction" | "getTurnUrls" | "addFcmToken" | "getMessage";
export type WebSocketSubscribeOptions = {
    once?: boolean;
};
export type GetUserInfoConfig = {
    id: number;
} | {
    username: string;
};
export type GetUserInfoResult = Failed | {
    success: true;
    user: UserData;
};
