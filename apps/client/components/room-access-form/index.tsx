"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { parseError } from "@/lib/utils";
import { BackButton } from "./components/back-button";
import { CreateRoomSection } from "./components/create-room-section";
import { InvitedSection } from "./components/invited-section";
import { JoinRoomSection } from "./components/join-room-section";
import { RedirectingCard } from "./components/redirecting-card";
import type { CreateRoomForm, JoinRoomForm } from "./types";
import { createRoom, isRoomIdValid, joinRoom } from "./utils";

interface RoomAccessFormProps {
  roomId: string;
}

const RoomAccessForm = ({ roomId }: RoomAccessFormProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  const handleJoinRoom = async (data: JoinRoomForm) => {
    setIsJoining(true);
    try {
      const joinPromise = joinRoom(data.roomId, data.name);
      toast.promise(joinPromise, {
        loading: "Joining room, please wait...",
        success: () => {
          router.push(`/room/${data.roomId}`);
          return "Joined room successfully. Happy coding!";
        },
        error: (error) => `Failed to join room.\n${parseError(error)}`,
      });
      await joinPromise;
      setIsSuccessful(true);
    } catch {
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateRoom = async (data: CreateRoomForm) => {
    setIsCreating(true);
    try {
      const createPromise = createRoom(data.name);
      toast.promise(createPromise, {
        loading: "Creating room, please wait...",
        success: (roomId) => {
          router.push(`/room/${roomId}`);
          navigator.clipboard.writeText(roomId);
          return "Room created successfully. Happy coding!";
        },
        error: (error) => `Failed to create room.\n${parseError(error)}`,
      });
      await createPromise;
      setIsSuccessful(true);
    } catch {
    } finally {
      setIsCreating(false);
    }
  };

  if (isSuccessful) {
    return (
      <div className="flex items-center justify-center py-8">
        <RedirectingCard />
      </div>
    );
  }

  if (roomId && isRoomIdValid(roomId)) {
    return (
      <div className="flex flex-col gap-4">
        <div className="space-y-1 text-center">
          <p className="text-sm text-white/60">Enter your name to join</p>
          <p className="font-medium font-mono text-base text-white">{roomId}</p>
        </div>
        <InvitedSection
          isCreating={isCreating}
          isSubmitting={isJoining}
          onSubmit={handleJoinRoom}
          roomId={roomId}
        />
        <BackButton disabled={isJoining} onClick={() => router.push("/")} />
      </div>
    );
  }

  if (roomId) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="font-medium text-white">Invalid room ID</p>
        <p className="text-sm text-white/50">
          Room ID should look like:{" "}
          <span className="font-bold font-mono text-white">XXXX-XXXX</span>
        </p>
        <BackButton disabled={isJoining} onClick={() => router.push("/")} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex rounded-xl bg-white/4 p-1">
        <button
          className={`flex-1 rounded-lg py-2 font-medium text-xs transition-all ${
            activeTab === "create"
              ? "bg-white/10 text-white"
              : "text-white/35 hover:text-white/60"
          }`}
          onClick={() => setActiveTab("create")}
          type="button"
        >
          Create Room
        </button>
        <button
          className={`flex-1 rounded-lg py-2 font-medium text-xs transition-all ${
            activeTab === "join"
              ? "bg-white/10 text-white"
              : "text-white/35 hover:text-white/60"
          }`}
          onClick={() => setActiveTab("join")}
          type="button"
        >
          Join Room
        </button>
      </div>

      {activeTab === "create" ? (
        <CreateRoomSection
          isJoining={isJoining}
          isSubmitting={isCreating}
          onSubmit={handleCreateRoom}
        />
      ) : (
        <JoinRoomSection
          defaultRoomId=""
          isCreating={isCreating}
          isSubmitting={isJoining}
          onSubmit={handleJoinRoom}
        />
      )}
    </div>
  );
};

export { RoomAccessForm };
