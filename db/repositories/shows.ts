import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { Show, shows, ShowWithDetails} from "../models/shows.ts";
import { movies } from "../models/movies.ts";
import { halls } from "../models/halls.ts";
import { eq, gte, and } from "drizzle-orm";

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
  async findOneWithDetails(id: Show["id"]): Promise<ShowWithDetails | null> {
    const result = await db
        .select({
            id: shows.id,
            movie_id: shows.movie_id,
            hall_id: shows.hall_id,
            start_time: shows.start_time,
            base_price: shows.base_price,
            title: movies.title,
            description: movies.description,
            image_url: movies.imageUrl,
            name: halls.name,
        })
        .from(shows)
        .leftJoin(movies, eq(shows.movie_id, movies.id))
        .leftJoin(halls, eq(shows.hall_id, halls.id))
        .where(eq(shows.id, id));

    const show = result[0];
    return show ?? null;
  }
  async delete(id: Show["id"]): Promise<void> {
    await db.delete(shows).where(eq(shows.id, id));
  }
  async create(value: any): Promise<Show> {
    const [show] = await db.insert(shows).values(value).returning();
    return show;
  }
  async update(id: Show["id"], value: Create<Show>): Promise<Show> {
  
    // Direkt das Datum-Objekt erstellen
    const [updatedShow] = await db.update(shows)
        .set({
            movie_id: value.movie_id,
            hall_id: value.hall_id,
            start_time: new Date(value.start_time)
        })
        .where(eq(shows.id, id))
        .returning();
    return updatedShow;
  }
  async findByMovieId(movieId: Show["movie_id"]): Promise<{ show_id: number, hall_id: number, hall_name: string | null, start_time: Date }[]> {
    const result = await db
      .select({
        show_id: shows.id,
        hall_id: shows.hall_id,
        hall_name: halls.name,
        start_time: shows.start_time,
      })
      .from(shows)
      .leftJoin(movies, eq(shows.movie_id, movies.id))
      .leftJoin(halls, eq(shows.hall_id, halls.id))
      .where(and(eq(shows.movie_id, movieId), gte(shows.start_time, new Date())))
      .orderBy(shows.start_time);

    return result;
  }
  async findByHallId(hallId: Show["hall_id"]): Promise<{ show_id: number, movie_id: number, hall_id: number, start_time: Date, title: string | null, description: string | null, image_url: string | null }[]> {
    const result = await db
      .select({
        show_id: shows.id,
        movie_id: shows.movie_id,
        hall_id: shows.hall_id,
        start_time: shows.start_time,
        title: movies.title,
        description: movies.description,
        image_url: movies.imageUrl
      })
      .from(shows)
      .leftJoin(movies, eq(shows.movie_id, movies.id))
      .where(eq(shows.hall_id, hallId));
    return result;
  }
}

export const showRepositoryObj = new ShowRepository();