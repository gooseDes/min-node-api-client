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
export interface MessageData {
    id: number;
    content: string;
    senderId: number;
    chatId: number;
    sentAt: Date;
    isSeen: boolean;
    seenAt: Date;
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
export type FetchUserInfoConfig = {
    id: number;
} | {
    username: string;
};
export type FetchUserInfoResult = Failed | {
    success: true;
    user: UserData;
};
export type FetchMessageInfoConfig = {
    id: number;
};
export type FetchMessageInfoResult = Failed | {
    success: true;
    message: MessageData;
};
export type FetchChatsResult = Failed | {
    success: true;
    chats: {
        id: number;
        type: "group" | "private";
        name: string;
        participants: UserData[];
    }[];
};
export type FetchChatMessagesConfig = {
    id: number;
};
export type FetchChatMessagesResult = Failed | {
    success: true;
    messages: (MessageData & {
        sender: UserData;
    })[];
};
