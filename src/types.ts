export interface ApiClientOptions {
    url: string;
}

export interface UserData {
    id: number;
    username: string;
    email: string;
}

export type RNFile = {
    uri: string;
    name: string;
    type: string;
};

export type Image = RNFile | File;

// Http types

export type HttpRequestOptions = {
    token?: string;
    body?: any;
};

export type LoginResult =
    | {
          success: false;
          message: string;
      }
    | {
          success: true;
          token: string;
          user: UserData;
      };

export type VerifyTokenResult =
    | {
          success: false;
          message: string;
      }
    | {
          success: true;
          is_valid: boolean;
      };

export type JsonHttpRequestResult =
    | {
          success: false;
          message: string;
      }
    | {
          success: true;
          data: any;
      };

export type AttachImageResult =
    | {
          success: false;
          message: string;
      }
    | {
          success: true;
          urls: string[];
      };

export type UploadAvatarResult =
    | {
          success: false;
          message: string;
      }
    | {
          success: true;
          url: string;
          avatar: string;
      };

// WebSocket types

export type WebSocketEvent =
    | "connect"
    | "disconnect"
    | "connect_error"
    | "error"
    | "message"
    | "deleteMessage"
    | "history"
    | "username"
    | "createChatResult"
    | "chats"
    | "userInfo"
    | "getChatWithResult"
    | "customEmojis"
    | "joinedVoice"
    | "turnUrls"
    | "requestedMessage";

export type WebSocketEmitEvent =
    | "msg"
    | "getChatHistory"
    | "getName"
    | "createChat"
    | "getChats"
    | "getUserInfo"
    | "getChatWith"
    | "getCustomEmojis"
    | "seenAll"
    | "deleteMessage"
    | "joinVoice"
    | "voiceAction"
    | "getTurnUrls"
    | "addFcmToken"
    | "getMessage";

export type WebSocketSubscribeOptions = {
    once?: boolean;
};
