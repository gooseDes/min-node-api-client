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
        const result = await client.fetchUser({ userId: 1 });
        expect(result).toEqual({ success: true, user: { id: 1, username: "user", avatar: "image" } });

        const result2 = await client.fetchUser({ username: "user" });
        expect(result2).toEqual({ success: true, user: { id: 1, username: "user", avatar: "image" } });
    });

    it("returns success:false on failure", async () => {
        const result = await client.fetchUser({ userId: 1488 });
        expect(result).toEqual({ success: false, message: "No such user" });

        const result2 = await client.fetchUser({ username: "nonexistent" });
        expect(result2).toEqual({ success: false, message: "No such user" });
    });
});

describe("ApiClient.fetchMessage", () => {
    it("returns success:true and message on success", async () => {
        const result = await client.fetchMessage({ messageId: 1 });
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

    it("returns success:false and error message on failure", async () => {
        const result = await client.fetchMessage({ messageId: 1488 });
        expect(result).toEqual({ success: false, message: "Message not found" });

        const result2 = await client.fetchMessage({ messageId: 2 });
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
                        { id: 1, username: "user", avatar: "image" },
                        { id: 2, username: "someone", avatar: "image" },
                    ],
                },
            ],
        });
    });
});

describe("ApiClient.fetchChatMessages", () => {
    it("returns success:true and history on success", async () => {
        const result = await client.fetchChatMessages({ chatId: 1 });
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

describe("ApiClient.createChat", () => {
    it("returns success:true and chat data on success", async () => {
        const result = await client.createChat({ targetUsername: "someone" });
        expect(result).toEqual({
            success: true,
            chat: {
                id: 1,
                name: "someone",
                type: "private",
                participants: [
                    { id: 1, username: "user", avatar: "image" },
                    { id: 2, username: "someone", avatar: "image" },
                ],
            },
        });
    });

    it("returns success:false and error message on failure", async () => {
        const result = await client.createChat({ targetUsername: "user" });
        expect(result).toEqual({ success: false, message: "Cannot create chat with yourself" });
    });
});

describe("ApiClient.sendMessage", () => {
    it("returns success:true on success", async () => {
        const result = await client.sendMessage({ chatId: 1, content: "Hello" });
        expect(result).toEqual({ success: true });
    });

    it("returns success:false and error message on failure", async () => {
        const result = await client.sendMessage({ chatId: 2, content: "Hello" });
        expect(result).toEqual({ success: false, message: "You are not in this chat" });
    });
});

describe("ApiClient.deleteMessage", () => {
    it("returns success:true on success", async () => {
        const result = await client.deleteMessage({ messageId: 1 });
        expect(result).toEqual({ success: true });
    });

    it("returns success:false and error message on failure", async () => {
        const result = await client.deleteMessage({ messageId: 2 });
        expect(result).toEqual({ success: false, message: "Message not found" });
    });
});

describe("ApiClient.linkFcmToken", () => {
    it("returns success:true on success", async () => {
        const result = await client.linkFcmToken({ token: "tok_123" });
        expect(result).toEqual({ success: true });
    });

    it("returns success:false and error message on failure", async () => {
        const result = await client.linkFcmToken({ token: "old_token" });
        expect(result).toEqual({ success: false, message: "Token already exists" });
    });
});

describe("ApiClient.subscribeToMessages", () => {
    it("subscribes to message events", () => {
        const sub = client.subscribeToMessages(data => {
            expect(data).toEqual({
                id: 1,
                content: "Hello",
                senderId: 1,
                chatId: 1,
                sentAt: toDate(1000),
                isSeen: false,
                seenAt: null,
                sender: { id: 1, username: "user", avatar: "image" },
            });
            sub.remove();
        });
        client.socket.emit("msg", { text: "Hello", chat: 1 });
    });
});

describe("ApiClient.subscribeToDeletingMessages", () => {
    it("subscribes to deleteMessage events", () => {
        const sub = client.subscribeToDeletingMessages(data => {
            expect(data).toEqual(1);
            sub.remove();
        });
        client.socket.emit("deleteMessage", { message: 1 });
    });
});
