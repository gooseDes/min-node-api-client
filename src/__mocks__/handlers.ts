import { http, HttpResponse } from "msw";

export const testUrl = "https://api.example.com";

export const handlers = [
    http.post<never, any>(`${testUrl}/login`, async ({ request }) => {
        const { email, password } = await request.json();
        if (email === "user@example.com" && password === "pass")
            return HttpResponse.json({ token: "tok_123", id: 1, username: "user" });
        return HttpResponse.json({ msg: "Invalid credentials" }, { status: 400 });
    }),

    http.post<never, any>(`${testUrl}/register`, async ({ request }) => {
        const { username, email, password } = await request.json();
        if (email === "user@example.com" || username === "user")
            return HttpResponse.json({ msg: "Username or email already in use" }, { status: 400 });
        return HttpResponse.json({ token: "tok_456", id: 2 });
    }),

    http.post<never, any>(`${testUrl}/verify`, async ({ request }) => {
        const { token } = await request.json();
        if (token === "tok_valid") return HttpResponse.json({ valid: true });
        return HttpResponse.json({ valid: false, msg: "Invalid token" });
    }),

    http.post<never, any>(`${testUrl}/attach`, async ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.includes("tok_valid"))
            return HttpResponse.json({ success: false, msg: "Unauthorized" }, { status: 400 });
        return HttpResponse.json({ success: true, urls: ["https://example.com/image.webp"] });
    }),

    http.post<never, any>(`${testUrl}/upload-avatar`, async ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.includes("tok_valid"))
            return HttpResponse.json({ success: false, msg: "Unauthorized" }, { status: 400 });
        return HttpResponse.json({ success: true, url: "https://example.com/avatar_suffix.webp", avatar: "avatar_suffix" });
    }),
];
