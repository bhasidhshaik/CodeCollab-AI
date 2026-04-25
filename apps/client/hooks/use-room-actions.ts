
import { useRouter } from "next/navigation";

import { leaveRoom, terminateRoom } from "@/lib/utils";

export const useRoomActions = () => {
  const router = useRouter();

  const handleLeaveRoom = () => {
    try {
      leaveRoom();
      router.push("/");
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  };

  const handleTerminateRoom = () => {
    try {
      terminateRoom();
      router.push("/");
    } catch (error) {
      console.error("Failed to terminate room:", error);
    }
  };

  return {
    handleLeaveRoom,
    handleTerminateRoom,
  };
};
