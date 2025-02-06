import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { seats, Seat } from "../models/seats.ts";
import { eq } from "drizzle-orm";
import { Hall } from "../models/halls.ts";
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
    async findByHallId(hallId: Hall["id"]): Promise<Seat[]> {
        const result = await db.select()
            .from(seats)
            .where(eq(seats.hall_id, Number(hallId)))
            .orderBy(seats.row_number, seats.seat_number);
        
        return result;
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
    async deleteByHallId(hallId: string): Promise<void> {
        await db.delete(seats).where(eq(seats.hall_id, Number(hallId)));
    }
}

export const seatRepositoryObj = new SeatRepository();