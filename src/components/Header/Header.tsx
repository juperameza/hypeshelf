"use client";

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useSyncUser } from "../../hooks/useSyncUser";
import styles from "./Header.module.scss";

interface HeaderProps {
  showUserButton?: boolean;
}

export function Header({ showUserButton = false }: HeaderProps) {
  // Sync user to Convex when authenticated
  useSyncUser();

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
            <Link href="/dashboard" className={styles.dashboardLink}>
              Dashboard
            </Link>
            {showUserButton && <UserButton afterSignOutUrl="/" />}
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
