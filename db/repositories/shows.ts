import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { Show, shows } from "../models/shows.ts";
import { eq } from "drizzle-orm";

export class ShowRepository implements Repository<Show> {
  async findAll(): Promise<Show[]> {
    const allShows = await db.select().from(shows);
    return allShows;
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
