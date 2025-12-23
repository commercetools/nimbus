/**
 * Remote DOM Module
 *
 * Exports the Remote DOM environment and utilities
 */

export {
  RemoteEnvironment,
  getRemoteEnvironment,
  resetRemoteEnvironment,
  setMessageSender,
  type SerializedNode,
  type SerializedMutation,
} from "./environment.js";

export { validateElement } from "./renderer.js";
export { MutationStreamServer } from "./websocket-server.js";
