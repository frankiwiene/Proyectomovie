export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry" | "meh";

export interface Reaction {
  type: ReactionType;
  users: string[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  reactions: Reaction[];
  reported: boolean;
  reportedBy: string[];
}

export type StreamingPlatform = "Netflix" | "Prime Video" | "HBO"| "Disney +"| "Crunchy Roll" | "Apple Tv";

export interface PlatformEntry {
  name: string;
  type: "subscription" | "rental";
}

export interface Movie {
  id: string;
  title: string;
  englishTitle?: string;
  poster: string;
  year: number;
  rating: number;
  description: string;
  genre: string;
  platforms: PlatformEntry[];
  duration?: string;
  classification?: string;
  reviews: Review[];
}