"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RecommendationForm } from "../RecommendationForm/RecommendationForm";
import { FilterBar } from "../FilterBar/FilterBar";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import { Genre, Recommendation } from "../../types";
import styles from "./RecommendationsDashboard.module.scss";

export function RecommendationsDashboard() {
  const [selectedGenre, setSelectedGenre] = useState<Genre | "all">("all");
  const [staffPicksOnly, setStaffPicksOnly] = useState(false);

  const recommendations = useQuery(api.recommendations.getAllRecommendations, {
    genre: selectedGenre === "all" ? undefined : selectedGenre,
    staffPicksOnly,
  });

  return (
    <div className={styles.dashboard}>
      <RecommendationForm />

      <section className={styles.recommendationsSection}>
        <h2 className={styles.sectionTitle}>All Recommendations</h2>

        <FilterBar
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          staffPicksOnly={staffPicksOnly}
          onStaffPicksChange={setStaffPicksOnly}
        />

        {recommendations === undefined ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading recommendations...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className={styles.empty}>
            {staffPicksOnly ? (
              <p>No staff picks yet. Check back later!</p>
            ) : selectedGenre !== "all" ? (
              <p>No recommendations in this genre yet. Be the first to add one!</p>
            ) : (
              <p>No recommendations yet. Add one above to get started!</p>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec._id}
                recommendation={rec as Recommendation}
                showActions={true}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
