import { Create } from "../../interfaces/repository.ts";
import { Show, shows, ShowWithDetails} from "../models/shows.ts";
import { movies } from "../models/movies.ts";
import { halls } from "../models/halls.ts";
import { eq, gte, and } from "drizzle-orm";
import { BaseRepository } from "./baseRepository.ts";

export class ShowRepository extends  BaseRepository<Show> {
  constructor() {
    super(shows);
  }

  async findAllWithDetails(): Promise<{id: number, movie_id: number, hall_id: number, start_time: Date, title: string | null, description: string | null, image_url: string | null, name: string | null}[]> {
    try {
        // Aktuelles Datum um Mitternacht (Start des Tages)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allShows = await this.db
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
 
  async findOneWithDetails(id: Show["id"]): Promise<ShowWithDetails | null> {
    const result = await this.db
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

  override async update(id: Show["id"], value: Create<Show>): Promise<Show> {
  
    // Direkt das Datum-Objekt erstellen
    const [updatedShow] = await this.db.update(shows)
        .set({
            movie_id: value.movie_id,
            hall_id: value.hall_id,
            start_time: new Date(value.start_time),
            base_price: value.base_price
        })
        .where(eq(shows.id, id))
        .returning();
    return updatedShow;
  }
  async findByMovieId(movieId: Show["movie_id"]): Promise<{ show_id: number, hall_id: number, hall_name: string | null, start_time: Date }[]> {
    const result = await this.db
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
    const result = await this.db
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