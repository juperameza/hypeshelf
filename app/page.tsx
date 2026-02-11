import { Header } from "@/src/components/Header/Header";
import { PublicRecommendationsList } from "@/src/components/PublicRecommendationsList/PublicRecommendationsList";
import { SignInButton } from "@clerk/nextjs";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            📚 Collect and share the stuff you're hyped about
          </h1>
          <p className={styles.heroDescription}>
            Join your friends in building the ultimate recommendation shelf.
            Movies, shows, books, podcasts – if it's worth the hype, add it here.
          </p>
          <SignInButton mode="modal">
            <button className={styles.ctaButton}>
              Sign in to add yours
            </button>
          </SignInButton>
        </section>

        <section className={styles.preview}>
          <h2 className={styles.previewTitle}>Latest Recommendations</h2>
          <PublicRecommendationsList limit={6} />
        </section>
      </main>
    </div>
  );
}
