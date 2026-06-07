import { testUrl } from "@/__mocks__/handlers";
import { ApiClient } from "@/client";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

const client = new ApiClient({ url: testUrl });

describe("ApiClient.getUserInfo", () => {
    beforeAll(() => {
        client.initSocket("tok_123");
    });

    afterAll(() => {
        client.closeSocket();
    });
    it("returns success:true and user info on success", async () => {
        const result = await client.getUserInfo({ id: 1 });
        expect(result).toEqual({ success: true, id: 1, username: "user", avatar: "image" });

        const result2 = await client.getUserInfo({ username: "user" });
        expect(result2).toEqual({ success: true, id: 1, username: "user", avatar: "image" });
    });

    it("returns success:false on failure", async () => {
        const result = await client.getUserInfo({ id: 1488 });
        expect(result).toEqual({ success: false, message: "No such user" });

        const result2 = await client.getUserInfo({ username: "nonexistent" });
        expect(result2).toEqual({ success: false, message: "No such user" });
    });
});
