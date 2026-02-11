"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Recommendation, GENRE_COLORS } from "../../types";
import { useUserRole } from "../../hooks/useUserRole";
import { canDeleteRecommendation, canToggleStaffPick } from "../../utils/permissions";
import styles from "./RecommendationCard.module.scss";

interface RecommendationCardProps {
  recommendation: Recommendation;
  showActions?: boolean;
}

export function RecommendationCard({
  recommendation,
  showActions = true,
}: RecommendationCardProps) {
  const { user } = useUser();
  const { role } = useUserRole();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteRecommendation = useMutation(api.recommendations.deleteRecommendation);
  const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);

  const canDelete = canDeleteRecommendation(role, user?.id, recommendation.userId);
  const canToggle = canToggleStaffPick(role);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRecommendation({ id: recommendation._id });
    } catch (error) {
      console.error("Failed to delete recommendation:", error);
      alert("Failed to delete recommendation. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleStaffPick = async () => {
    try {
      await toggleStaffPick({ id: recommendation._id });
    } catch (error) {
      console.error("Failed to toggle staff pick:", error);
      alert("Failed to toggle staff pick. Please try again.");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`${styles.card} ${recommendation.isStaffPick ? styles.staffPick : ""}`}
    >
      {recommendation.isStaffPick && (
        <div className={styles.staffPickBadge}>
          <span>⭐</span> Staff Pick
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.userInfo}>
          {recommendation.userImage ? (
            <img
              src={recommendation.userImage}
              alt={recommendation.userName}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {recommendation.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className={styles.userName}>{recommendation.userName}</span>
        </div>
        <span
          className={styles.genreBadge}
          style={{ backgroundColor: GENRE_COLORS[recommendation.genre] }}
        >
          {recommendation.genre.toUpperCase()}
        </span>
      </div>

      <div className={styles.content}>
        <a
          href={recommendation.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.title}
        >
          {recommendation.title}
        </a>
        <p className={styles.blurb}>{recommendation.blurb}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(recommendation.createdAt)}</span>

        {showActions && (canDelete || canToggle) && (
          <div className={styles.actions}>
            {canToggle && (
              <button
                onClick={handleToggleStaffPick}
                className={styles.staffPickButton}
                title={
                  recommendation.isStaffPick
                    ? "Remove Staff Pick"
                    : "Mark as Staff Pick"
                }
              >
                {recommendation.isStaffPick ? "★ Unmark" : "☆ Mark Pick"}
              </button>
            )}

            {canDelete && !showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            )}

            {canDelete && showDeleteConfirm && (
              <div className={styles.confirmDelete}>
                <span>Delete?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={styles.confirmYes}
                >
                  {isDeleting ? "..." : "Yes"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={styles.confirmNo}
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
