"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import { Recommendation } from "../../types";
import styles from "./PublicRecommendationsList.module.scss";

interface PublicRecommendationsListProps {
  limit?: number;
}

export function PublicRecommendationsList({ limit = 6 }: PublicRecommendationsListProps) {
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

  return (
    <div className={styles.grid}>
      <SignedIn>
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec._id}
            recommendation={rec as Recommendation}
            showActions={false}
            showUserInfo={true}
          />
        ))}
      </SignedIn>
      <SignedOut>
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec._id}
            recommendation={rec as Recommendation}
            showActions={false}
            showUserInfo={false}
          />
        ))}
      </SignedOut>
    </div>
  );
}
