export class Review {
  user: string;
  rating: number;
  comment: string;
}
export class Movie {
  id?: string;
  title: string;
  releaseDate: Date;
  duration: number;
  director: string;
  actors: string[];
  reviews?: Review[];
  avg_rating?: number;
  user?: string;
}
