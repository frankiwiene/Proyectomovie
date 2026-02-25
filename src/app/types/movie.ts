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
  reported: boolean;
  reportedBy: string[];
}

export type StreamingPlatform = "Netflix" | "Prime Video" | "HBO"| "Disney +"| "Crunchy Roll" | "Apple Tv";

export interface Movie {
  id: string;
  title: string;
  poster: string;
  year: number;
  rating: number;
  description: string;
  genre: string;
  platforms: StreamingPlatform[];
  reviews: Review[];
}