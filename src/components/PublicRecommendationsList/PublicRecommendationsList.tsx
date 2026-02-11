"use client";

import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import { Recommendation } from "../../types";
import styles from "./PublicRecommendationsList.module.scss";

interface PublicRecommendationsListProps {
  limit?: number;
}

const PAGE_SIZE = 6;

export function PublicRecommendationsList({ limit = 6 }: PublicRecommendationsListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const recommendations = useQuery(api.recommendations.getPublicRecommendations, {
    limit,
  });

  if (recommendations === undefined) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading recommendations...</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No recommendations yet. Be the first to add one!</p>
      </div>
    );
  }

  const visibleRecommendations = recommendations.slice(0, visibleCount);
  const remaining = recommendations.length - visibleCount;

  return (
    <>
      <div className={styles.grid}>
        <SignedIn>
          {visibleRecommendations.map((rec) => (
            <RecommendationCard
              key={rec._id}
              recommendation={rec as Recommendation}
              showActions={false}
              showUserInfo={true}
            />
          ))}
        </SignedIn>
        <SignedOut>
          {visibleRecommendations.map((rec) => (
            <RecommendationCard
              key={rec._id}
              recommendation={rec as Recommendation}
              showActions={false}
              showUserInfo={false}
            />
          ))}
        </SignedOut>
      </div>
      {remaining > 0 && (
        <button
          className={styles.showMore}
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          Show More ({remaining} remaining)
        </button>
      )}
    </>
  );
}
