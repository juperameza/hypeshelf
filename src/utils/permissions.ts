import { UserRole } from "../types";

/**
 * Check if a user can delete a recommendation.
 * User can delete if they own the recommendation OR if they are an admin.
 * Note: This is for UI purposes only - actual permission check happens server-side.
 */
export function canDeleteRecommendation(
  userRole: UserRole | null,
  currentUserId: string | null | undefined,
  recommendationUserId: string
): boolean {
  if (!currentUserId) return false;

  const isOwner = currentUserId === recommendationUserId;
  const isAdmin = userRole === "admin";

  return isOwner || isAdmin;
}

/**
 * Check if a user can toggle staff picks.
 * Only admins can toggle staff picks.
 * Note: This is for UI purposes only - actual permission check happens server-side.
 */
export function canToggleStaffPick(userRole: UserRole | null): boolean {
  return userRole === "admin";
}

/**
 * Check if a user is an admin.
 */
export function isAdmin(userRole: UserRole | null): boolean {
  return userRole === "admin";
}

/**
 * Check if a user is authenticated.
 */
export function isAuthenticated(userId: string | null | undefined): boolean {
  return !!userId;
}
