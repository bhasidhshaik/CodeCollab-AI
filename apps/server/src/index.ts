import { createServer } from "http";
import {
  CodeServiceMsg,
  PointerServiceMsg,
  RoomServiceMsg,
  ScrollServiceMsg,
  StreamServiceMsg,
} from "@codex/types/message";
import type { Cursor, EditOp } from "@codex/types/operation";
import type { Pointer } from "@codex/types/pointer";
import type { Scroll } from "@codex/types/scroll";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@codex/types/socket-events";
import type { ExecutionResult } from "@codex/types/terminal";
import type { SignalData } from "simple-peer";
import { Server } from "socket.io";

import * as codeService from "@/service/code-service";
import * as pointerService from "@/service/pointer-service";
import * as roomService from "@/service/room-service";
import * as scrollService from "@/service/scroll-service";
import * as userService from "@/service/user-service";
import * as webRTCService from "@/service/webrtc-service";

import {
  ALLOWED_ORIGINS,
  getCorsHeaders,
  isVercelDeployment,
} from "./cors-config";

const PORT = process.env.PORT || 3001;

const httpServer = createServer((req, res) => {
  if (req.url === "/") {
    const origin = req.headers.origin || "";
    const headers = getCorsHeaders(origin);
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
    res.setHeader("Content-Type", "text/plain");
    res.end(
      "Hello from codex-server! Go to https://codex.bhasidhshaik.dev/ to start coding."
    );
  }
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === "development") {
        callback(null, true);
        return;
      }
      if (
        !origin ||
        ALLOWED_ORIGINS.includes(origin as (typeof ALLOWED_ORIGINS)[number]) ||
        isVercelDeployment(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  maxHttpBufferSize: 5e6,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

httpServer.listen(PORT, () => {
  console.log(`codex-server listening on port: ${PORT}`);
});

io.on("connection", (socket) => {
  socket.on("ping", () => socket.emit("pong"));
  socket.on(RoomServiceMsg.CREATE, async (name: string) =>
    roomService.create(socket, name)
  );
  socket.on(RoomServiceMsg.JOIN, async (roomID: string, name: string) =>
    roomService.join(socket, io, roomID, name)
  );
  socket.on(RoomServiceMsg.LEAVE, async () => roomService.leave(socket, io));
  socket.on(RoomServiceMsg.TERMINATE, async () =>
    roomService.terminate(socket, io)
  );
  socket.on(RoomServiceMsg.SYNC_USERS, async () =>
    roomService.getUsersInRoom(socket, io)
  );
  socket.on(CodeServiceMsg.SYNC_CODE, async () =>
    codeService.syncCode(socket, io)
  );
  socket.on(CodeServiceMsg.UPDATE_CODE, async (op: EditOp) =>
    codeService.updateCode(socket, op)
  );
  socket.on(CodeServiceMsg.UPDATE_CURSOR, async (cursor: Cursor) =>
    userService.updateCursor(socket, cursor)
  );
  socket.on(CodeServiceMsg.SYNC_LANG, async () =>
    codeService.syncLang(socket, io)
  );
  socket.on(CodeServiceMsg.UPDATE_LANG, async (langID: string) =>
    codeService.updateLang(socket, langID)
  );
  socket.on(ScrollServiceMsg.UPDATE_SCROLL, async (scroll: Scroll) =>
    scrollService.updateScroll(socket, scroll)
  );
  socket.on(RoomServiceMsg.SYNC_MD, () => {
    roomService.syncNote(socket, io);
  });
  socket.on(RoomServiceMsg.UPDATE_MD, async (note: string) =>
    roomService.updateNote(socket, note)
  );
  socket.on(CodeServiceMsg.EXEC, async (isExecuting: boolean) =>
    roomService.updateExecuting(socket, isExecuting)
  );
  socket.on(CodeServiceMsg.UPDATE_TERM, async (data: ExecutionResult) =>
    roomService.updateTerminal(socket, data)
  );
  socket.on(StreamServiceMsg.STREAM_READY, () =>
    webRTCService.onStreamReady(socket)
  );
  socket.on(
    StreamServiceMsg.SIGNAL,
    (data: { signal: SignalData; targetUserID: string }) =>
      webRTCService.handleSignal(socket, data)
  );
  socket.on(StreamServiceMsg.CAMERA_OFF, () =>
    webRTCService.onCameraOff(socket)
  );
  socket.on(StreamServiceMsg.MIC_STATE, (micOn: boolean) =>
    webRTCService.handleMicState(socket, micOn)
  );
  socket.on(StreamServiceMsg.SPEAKER_STATE, (speakersOn: boolean) =>
    webRTCService.handleSpeakerState(socket, speakersOn)
  );
  socket.on(PointerServiceMsg.POINTER, (pointer: Pointer) =>
    pointerService.updatePointer(socket, pointer)
  );
  socket.on("disconnecting", () => roomService.leave(socket, io));
});