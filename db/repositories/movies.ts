import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { movies, Movie } from "../models/movies.ts";
import { eq } from "drizzle-orm";

export class MovieRepository implements Repository<Movie> {
    async findAll(): Promise<Movie[]> {
        const allMovies = await db.select().from(movies);
        return allMovies;
    }
    async find(id: Movie['id']): Promise< Movie | null> {
        const result = await db.query.movies.findFirst({
            where: eq(movies.id, id),
          });
          return result ?? null;
    }
    async delete(id: Movie['id']): Promise<void> {
        await db.delete(movies).where(eq(movies.id, id));
    }
    async create(value: any): Promise<Movie> {
      const [movie] = await db.insert(movies).values(value).returning();
      return movie;
    }
    async update(id: Movie['id'], value: Create<Movie>): Promise<Movie> {
        const [updatedMovie] = await db.update(movies).set(value).where(eq(movies.id, id)).returning();
        return updatedMovie;
    }
}


export const movieRepository = new MovieRepository();