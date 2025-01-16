import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { Show, shows} from "../models/shows.ts";
import { movies } from "../models/movies.ts";
import { halls } from "../models/halls.ts";
import { eq, gte } from "drizzle-orm";

export class ShowRepository implements Repository<Show> {
  async findAll(): Promise<Show[]> {
    const allShows = await db.select().from(shows);
    return allShows;
  }
  async findAllWithDetails(): Promise<{id: number, movie_id: number, hall_id: number, start_time: Date, title: string | null, description: string | null, image_url: string | null, name: string | null}[]> {
    try {
        // Aktuelles Datum um Mitternacht (Start des Tages)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allShows = await db
            .select({
                id: shows.id,
                movie_id: shows.movie_id,
                hall_id: shows.hall_id,
                start_time: shows.start_time,
                title: movies.title,
                description: movies.description,
                image_url: movies.imageUrl,
                name: halls.name,
            })
            .from(shows)
            .leftJoin(movies, eq(shows.movie_id, movies.id))
            .leftJoin(halls, eq(shows.hall_id, halls.id))
            .where(
                // Filtert Shows, die heute oder in der Zukunft stattfinden
                gte(shows.start_time, today)
            )
            // Sortiert nach Startzeit aufsteigend
            .orderBy(shows.start_time);

        console.log(allShows);
        return allShows;
    } catch (error) {
        console.error('Error in findAllWithDetails:', error);
        throw error;
    }
  }
  async find(id: Show["id"]): Promise<Show | null> {
    const result = await db.query.shows.findFirst({
      where: eq(shows.id, id),
    });
    return result ?? null;
  }
  async delete(id: Show["id"]): Promise<void> {
    await db.delete(shows).where(eq(shows.id, id));
  }
  async create(value: any): Promise<Show> {
    console.log(value);
    const [show] = await db.insert(shows).values(value).returning();
    return show;
  }
  async update(id: Show["id"], value: Create<Show>): Promise<Show> {
    const [updatedShow] = await db.update(shows).set(value).where(
      eq(shows.id, id),
    ).returning();
    return updatedShow;
  }
  async findByMovieId(movieId: Show["movie_id"]): Promise<Show[]> {
    const result = await db.query.shows.findMany({
      where: eq(shows.movie_id, movieId),
    });
    return result;
  }
}

export const showRepository = new ShowRepository();
