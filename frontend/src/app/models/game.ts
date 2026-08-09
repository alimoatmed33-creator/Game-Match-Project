export interface Game {

  _id?: string;

  name: string;

  description: string;

  genre: string;

  platform: string[];

  mode: string;

  priceType: string;

  publisher: string;

  releaseYear: number;

  rating: number;

  image: string;

  featured: boolean;

}