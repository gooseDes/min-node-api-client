import { testUrl } from "@/__mocks__/handlers";
import { WebSocketClient } from "@/websocket";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "@jest/globals";

const socket = new WebSocketClient(testUrl);

describe("WebSocketClient", () => {
    beforeAll(() => {
        socket.init("tok_123");
    });
    it("subscribes to events", done => {
        socket.subscribe(
            "message",
            data => {
                try {
                    expect(data).toEqual({
                        id: 1,
                        text: "text",
                        author_id: 1,
                        author_avatar: "image",
                        author: "author",
                        chat: 1,
                        sent_at: 1000,
                    });
                    done();
                } catch (error: any) {
                    done(error);
                }
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

afterEach(() => {
    socket.reset();
});

afterAll(() => {
    socket.close();
});
