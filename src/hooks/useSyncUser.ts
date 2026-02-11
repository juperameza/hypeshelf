"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

/**
 * Custom hook to sync the current Clerk user to Convex database.
 * Should be called in a component that renders when user is authenticated.
 * Automatically syncs user data on mount and when user data changes.
 */
export function useSyncUser() {
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (isLoaded && user) {
      syncUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? user.firstName ?? "Anonymous",
      });
    }
  }, [isLoaded, user, syncUser]);
}
