import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/src/components/Header/Header";
import { RecommendationForm } from "@/src/components/RecommendationForm/RecommendationForm";
import { MyRecommendations } from "@/src/components/MyRecommendations/MyRecommendations";
import styles from "./page.module.scss";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className={styles.container}>
      <Header showUserButton />
      <main className={styles.main}>
        <RecommendationForm />
        <MyRecommendations />
      </main>
    </div>
  );
}
