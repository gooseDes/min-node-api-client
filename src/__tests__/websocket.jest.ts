import { testUrl } from "@/__mocks__/handlers";
import { WebSocketClient } from "@/websocket";
import { describe, expect, it } from "@jest/globals";

const socket = new WebSocketClient(testUrl);
socket.init("tok_123");

describe("WebSocketClient", () => {
    it("subscribes to events", () => {
        socket.subscribe(
            "message",
            data => {
                expect(data).toBe({
                    id: 1,
                    text: "text",
                    author_id: 1,
                    author_avatar: "image",
                    author: "author",
                    chat: 1,
                    sent_at: 1000,
                });
            },
            { once: true },
        );
        socket.emit("msg", {
            id: 1,
            text: "text",
            author_id: 1,
            author_avatar: "image",
            author: "author",
            chat: 1,
            sent_at: 1000,
        });
    });
});

socket.close();
