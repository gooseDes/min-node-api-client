export class ApiClient {
    constructor(options) {
        this.url = options.url;
    }
    async login(email, password) {
        const response = await fetch(`${this.url}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json.msg };
        }
        return { success: true, token: json.token, user: { id: json.id, email: email, username: json.username } };
    }
    async register(username, email, password) {
        const response = await fetch(`${this.url}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json.msg };
        }
        return { success: true, token: json.token, user: { id: json.id, email, username } };
    }
}
