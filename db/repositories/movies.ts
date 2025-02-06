import { movies, Movie } from "../models/movies.ts";
import { BaseRepository } from "./baseRepository.ts";

export class MovieRepository extends BaseRepository<Movie> {
   constructor() {
         super(movies);
    }
}


export const movieRepositoryObj = new MovieRepository();