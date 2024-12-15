import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { seats, Seat } from "../models/seats.ts";
import { eq } from "drizzle-orm";

export class SeatRepository implements Repository<Seat> {
    async findAll(): Promise<Seat[]> {
        const allSeats = await db.select().from(seats);
        return allSeats;
    }
    async find(id: Seat['id']): Promise< Seat | null> {
        const result = await db.query.seats.findFirst({
            where: eq(seats.id, id),
          });
          return result ?? null;
    }
    async delete(id: Seat['id']): Promise<void> {
        await db.delete(seats).where(eq(seats.id, id));
    }
    async create(value: Create<Seat>): Promise<Seat> {
      const [seat] = await db.insert(seats).values(value).returning();
      return seat;
    }
    async update(id: Seat['id'], value: Create<Seat>): Promise<Seat> {
        const [updatedSeat] = await db.update(seats).set(value).where(eq(seats.id, id)).returning();
        return updatedSeat;
    }
}

export const seatRepository = new SeatRepository();