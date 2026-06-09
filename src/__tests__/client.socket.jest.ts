import { testUrl } from "@/__mocks__/handlers";
import { ApiClient } from "@/client";
import { toDate } from "@/utils";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

const client = new ApiClient({ url: testUrl });

beforeAll(() => {
    client.initSocket("tok_123");
});

afterAll(() => {
    client.closeSocket();
});

describe("ApiClient.fetchUser", () => {
    it("returns success:true and user info on success", async () => {
        const result = await client.fetchUser({ id: 1 });
        expect(result).toEqual({ success: true, user: { id: 1, username: "user", avatar: "image" } });

        const result2 = await client.fetchUser({ username: "user" });
        expect(result2).toEqual({ success: true, user: { id: 1, username: "user", avatar: "image" } });
    });

    it("returns success:false on failure", async () => {
        const result = await client.fetchUser({ id: 1488 });
        expect(result).toEqual({ success: false, message: "No such user" });

        const result2 = await client.fetchUser({ username: "nonexistent" });
        expect(result2).toEqual({ success: false, message: "No such user" });
    });
});

describe("ApiClient.fetchMessage", () => {
    it("returns success:true and message on success", async () => {
        const result = await client.fetchMessage({ id: 1 });
        expect(result).toEqual({
            success: true,
            message: {
                id: 1,
                chatId: 1,
                senderId: 1,
                content: "Hello",
                sentAt: toDate(1000),
                isSeen: false,
                seenAt: toDate(1000),
            },
        });
    });

    it("returns success:false on failure", async () => {
        const result = await client.fetchMessage({ id: 1488 });
        expect(result).toEqual({ success: false, message: "Message not found" });

        const result2 = await client.fetchMessage({ id: 2 });
        expect(result2).toEqual({ success: false, message: "You are not in this chat" });
    });
});

describe("ApiClient.fetchChats", () => {
    it("returns success:true and chats on success", async () => {
        const result = await client.fetchChats();
        expect(result).toEqual({
            success: true,
            chats: [
                {
                    id: 1,
                    type: "private",
                    name: "someone",
                    participants: [
                        { id: 1, name: "user", avatar: "image" },
                        { id: 2, name: "someone", avatar: "image" },
                    ],
                },
            ],
        });
    });
});

describe("ApiClient.fetchChatMessages", () => {
    it("returns success:true and history on success", async () => {
        const result = await client.fetchChatMessages({ id: 1 });
        expect(result).toEqual({
            success: true,
            messages: [
                {
                    id: 1,
                    content: "Hello",
                    senderId: 1,
                    chatId: 1,
                    sentAt: toDate(1000),
                    isSeen: false,
                    seenAt: toDate(1000),
                    sender: {
                        id: 1,
                        username: "someone",
                        avatar: "image",
                    },
                },
            ],
        });
    });
});
