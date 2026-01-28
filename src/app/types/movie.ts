export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export type StreamingPlatform = "Netflix" | "Prime Video" | "HBO";

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