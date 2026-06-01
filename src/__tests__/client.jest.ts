import { ApiClient } from "@/client";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const client = new ApiClient({ url: "https://api.example.com" });

const mockResponse = (body: object, ok = true, status = 200) =>
    Promise.resolve({
        ok,
        status,
        json: () => Promise.resolve(body),
    } as Response);

beforeEach(() => {
    mockFetch.mockClear();
});

describe("ApiClient.login", () => {
    it("returns success:true and user data on success", async () => {
        mockFetch.mockReturnValueOnce(mockResponse({ token: "tok_123", id: 1, username: "alice" }));

        const result = await client.login("alice@example.com", "pass123");

        expect(result).toEqual({
            success: true,
            token: "tok_123",
            user: { id: 1, email: "alice@example.com", username: "alice" },
        });
    });

    it("returns success:false and message on error", async () => {
        mockFetch.mockReturnValueOnce(mockResponse({ message: "Invalid credentials" }, false, 401));

        const result = await client.login("alice@example.com", "wrong");

        expect(result).toEqual({ success: false, message: "Invalid credentials" });
    });

    it("sends POST to /login with correct headers and body", async () => {
        mockFetch.mockReturnValueOnce(mockResponse({ token: "tok_123", id: 1, username: "alice" }));

        await client.login("alice@example.com", "pass123");

        expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "alice@example.com", password: "pass123" }),
        });
    });
});

describe("ApiClient.register", () => {
    it("returns success:true and user data on success", async () => {
        mockFetch.mockReturnValueOnce(mockResponse({ token: "tok_456", id: 2, username: "bob" }));

        const result = await client.register("bob", "bob@example.com", "secret");

        expect(result).toEqual({
            success: true,
            token: "tok_456",
            user: { id: 2, email: "bob@example.com", username: "bob" },
        });
    });

    it("returns success:false and message if email or username is already in use", async () => {
        mockFetch.mockReturnValueOnce(mockResponse({ message: "Email already in use" }, false, 409));

        const result = await client.register("bob", "bob@example.com", "secret");

        expect(result).toEqual({ success: false, message: "Email already in use" });
    });

    it("sends POST to /register with correct headers and body", async () => {
        mockFetch.mockReturnValueOnce(mockResponse({ token: "tok_456", id: 2, username: "bob" }));

        await client.register("bob", "bob@example.com", "secret");

        expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "bob", email: "bob@example.com", password: "secret" }),
        });
    });
});
