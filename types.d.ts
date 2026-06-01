export interface ApiClientOptions {
    url: string;
}
export type LoginResult = {
    success: false;
    message: string;
} | {
    success: true;
    token: string;
    user: UserData;
};
export interface UserData {
    id: number;
    username: string;
    email: string;
}
