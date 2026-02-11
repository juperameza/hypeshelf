import { Header } from "@/src/components/Header/Header";
import { PublicRecommendationsList } from "@/src/components/PublicRecommendationsList/PublicRecommendationsList";
import { RecommendationsList } from "@/src/components/RecommendationsList/RecommendationsList";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
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
          <SignedOut>
            <SignInButton mode="modal">
              <button className={styles.ctaButton}>
                Sign in to add yours
              </button>
            </SignInButton>
          </SignedOut>
        </section>

        <SignedIn>
          <section className={styles.preview}>
            <RecommendationsList />
          </section>
        </SignedIn>

        <SignedOut>
          <section className={styles.preview}>
            <h2 className={styles.previewTitle}>Latest Recommendations</h2>
            <PublicRecommendationsList limit={6} />
          </section>
        </SignedOut>
      </main>
    </div>
  );
}
