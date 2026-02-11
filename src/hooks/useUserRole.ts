"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserRole } from "../types";

/**
 * Custom hook to get the current user's role from Convex.
 * Returns the role ("admin" | "user") or null if not authenticated.
 * Also returns loading state for UI feedback.
 */
export function useUserRole(): {
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
} {
  const role = useQuery(api.users.getCurrentUserRole);

  return {
    role: role ?? null,
    isLoading: role === undefined,
    isAdmin: role === "admin",
  };
}
