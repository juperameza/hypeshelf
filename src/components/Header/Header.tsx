"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncUser } from "../../hooks/useSyncUser";
import styles from "./Header.module.scss";

interface HeaderProps {
  showUserButton?: boolean;
}

export function Header({ showUserButton = true }: HeaderProps) {
  // Sync user to Convex when authenticated
  useSyncUser();
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>📚</span>
          <span className={styles.logoText}>HypeShelf</span>
        </Link>

        <nav className={styles.nav}>
          <SignedOut>
            <SignInButton mode="modal">
              <button className={styles.signInButton}>Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className={styles.signUpButton}>Sign Up</button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            {!isDashboardRoute && (
              <Link href="/dashboard" className={styles.dashboardLink}>
                Add Recommendation
              </Link>
            )}
            {showUserButton && <UserButton afterSignOutUrl="/" />}
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
