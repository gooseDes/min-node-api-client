import { setupServer } from "msw/node";
import { httpHandlers, wsChannel } from "./handlers";

export const server = setupServer(...httpHandlers);
