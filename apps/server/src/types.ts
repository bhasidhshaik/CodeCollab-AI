/**
 * Typed Socket.IO server types for compile-time event safety.
 *
 * By Shaik Bhasidh (https://bhasidhshaik.dev)
 */

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@codex/types/socket-events";
import type { Server as IOServer, Socket as IOSocket } from "socket.io";

export type Server = IOServer<ClientToServerEvents, ServerToClientEvents>;
export type Socket = IOSocket<ClientToServerEvents, ServerToClientEvents>;
