"use client";

import { Genre, GENRES } from "../../types";
import styles from "./FilterBar.module.scss";

interface FilterBarProps {
  selectedGenre: Genre | "all";
  onGenreChange: (genre: Genre | "all") => void;
  staffPicksOnly: boolean;
  onStaffPicksChange: (staffPicksOnly: boolean) => void;
}

export function FilterBar({
  selectedGenre,
  onGenreChange,
  staffPicksOnly,
  onStaffPicksChange,
}: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label htmlFor="genre-filter" className={styles.label}>
          Filter by Genre
        </label>
        <select
          id="genre-filter"
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value as Genre | "all")}
          className={styles.select}
        >
          <option value="all">All Genres</option>
          {GENRES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={staffPicksOnly}
            onChange={(e) => onStaffPicksChange(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>⭐ Staff Picks Only</span>
        </label>
      </div>
    </div>
  );
}
