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
export type HttpRequestOptions = {
    token?: string;
    body?: any;
};
export type LoginResult = {
    success: false;
    message: string;
} | {
    success: true;
    token: string;
    user: UserData;
};
export type VerifyTokenResult = {
    success: false;
    message: string;
} | {
    success: true;
    is_valid: boolean;
};
export type JsonHttpRequestResult = {
    success: false;
    message: string;
} | {
    success: true;
    data: any;
};
export type AttachImageResult = {
    success: false;
    message: string;
} | {
    success: true;
    urls: string[];
};
export type UploadAvatarResult = {
    success: false;
    message: string;
} | {
    success: true;
    url: string;
    avatar: string;
};
