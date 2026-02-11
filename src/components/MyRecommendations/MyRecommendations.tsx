"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import { Recommendation } from "../../types";
import styles from "./MyRecommendations.module.scss";

const PAGE_SIZE = 6;

export function MyRecommendations() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const recommendations = useQuery(api.recommendations.getMyRecommendations);

  const visibleRecommendations = recommendations?.slice(0, visibleCount);
  const remaining = recommendations ? recommendations.length - visibleCount : 0;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My Recommendations</h2>
        {recommendations && recommendations.length > 0 && (
          <span className={styles.countBadge}>{recommendations.length}</span>
        )}
      </div>

      {recommendations === undefined ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your recommendations...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven&apos;t added any recommendations yet. Use the form above to share your first pick!</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {visibleRecommendations!.map((rec) => (
              <RecommendationCard
                key={rec._id}
                recommendation={rec as Recommendation}
                showActions={true}
                showUserInfo={false}
              />
            ))}
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
      )}
    </section>
  );
}
