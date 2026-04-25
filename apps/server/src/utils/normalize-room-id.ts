/**
 * Utility function for normalizing room IDs by removing hyphens.
 * Features:
 * - Hyphen removal
 * - Room ID formatting
 *
 * By Shaik Bhasidh (https://bhasidhshaik.dev)
 */

export const normalizeRoomId = (roomId: string): string => {
  return roomId.replace(/-/g, "");
};
