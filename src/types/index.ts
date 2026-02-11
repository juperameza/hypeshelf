import { Id } from "../../convex/_generated/dataModel";

export type Genre =
  | "horror"
  | "action"
  | "comedy"
  | "drama"
  | "scifi"
  | "documentary"
  | "other";

export type UserRole = "admin" | "user";

export interface Recommendation {
  _id: Id<"recommendations">;
  _creationTime: number;
  title: string;
  genre: Genre;
  link: string;
  blurb: string;
  userId: string;
  userName: string;
  userImage?: string;
  isStaffPick: boolean;
  createdAt: number;
}

export interface User {
  _id: Id<"users">;
  _creationTime: number;
  clerkId: string;
  role: UserRole;
  email: string;
  name: string;
}

export interface RecommendationFormData {
  title: string;
  genre: Genre;
  link: string;
  blurb: string;
}

export const GENRES: { value: Genre; label: string }[] = [
  { value: "horror", label: "Horror" },
  { value: "action", label: "Action" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "scifi", label: "Sci-Fi" },
  { value: "documentary", label: "Documentary" },
  { value: "other", label: "Other" },
];

export const GENRE_COLORS: Record<Genre, string> = {
  horror: "#dc2626",
  action: "#ea580c",
  comedy: "#eab308",
  drama: "#8b5cf6",
  scifi: "#06b6d4",
  documentary: "#10b981",
  other: "#6b7280",
};
