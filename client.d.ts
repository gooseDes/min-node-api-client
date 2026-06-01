import { ApiClientOptions, LoginResult } from "./types";
export declare class ApiClient {
    private url;
    constructor(options: ApiClientOptions);
    login(email: string, password: string): Promise<LoginResult>;
    register(username: string, email: string, password: string): Promise<LoginResult>;
}
