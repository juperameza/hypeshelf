"use client";

import { useState, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Genre, GENRES } from "../../types";
import styles from "./RecommendationForm.module.scss";

export function RecommendationForm() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<Genre>("other");
  const [link, setLink] = useState("");
  const [blurb, setBlurb] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createRecommendation = useMutation(api.recommendations.createRecommendation);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Client-side validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!link.trim()) {
      setError("Link is required");
      return;
    }
    if (!validateUrl(link)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    if (!blurb.trim()) {
      setError("Blurb is required - tell us why you're hyped!");
      return;
    }

    setIsSubmitting(true);

    try {
      await createRecommendation({
        title: title.trim(),
        genre,
        link: link.trim(),
        blurb: blurb.trim(),
      });

      // Reset form on success
      setTitle("");
      setGenre("other");
      setLink("");
      setBlurb("");
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create recommendation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>Add a Recommendation</h2>

      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div className={styles.success}>Recommendation added to the shelf!</div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you recommending?"
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="genre" className={styles.label}>
          Genre <span className={styles.required}>*</span>
        </label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value as Genre)}
          className={styles.select}
          disabled={isSubmitting}
        >
          {GENRES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="link" className={styles.label}>
          Link <span className={styles.required}>*</span>
        </label>
        <input
          type="url"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className={styles.input}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="blurb" className={styles.label}>
          Why you're hyped about it <span className={styles.required}>*</span>
        </label>
        <textarea
          id="blurb"
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          placeholder="Tell us what makes this worth the hype..."
          className={styles.textarea}
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add to Shelf"}
      </button>
    </form>
  );
}
