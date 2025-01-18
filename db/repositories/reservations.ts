import { db } from "../db.ts";
import { Repository, Create } from "../../interfaces/repository.ts";
import { reservations, Reservation } from "../models/reservations.ts";
import { eq } from "drizzle-orm";


export class ReservationRepository implements Repository<Reservation> {
  async findAll(): Promise<Reservation[]> {
    const allReservations = await db.select().from(reservations);
    return allReservations;
  }
  async find(id: Reservation["id"]): Promise<Reservation | null> {
    const result = await db.query.reservations.findFirst({
      where: eq(reservations.id, id),
    });
    return result ?? null;
  }
  async delete(id: Reservation["id"]): Promise<void> {
    await db.delete(reservations).where(eq(reservations.id, id));
  }
  async create(value: Create<Reservation>): Promise<Reservation> {
    const [reservation] = await db.insert(reservations).values(value).returning();
    return reservation;
  }
  async update(id: Reservation["id"], value: Create<Reservation>): Promise<Reservation> {
    const [updatedReservation] = await db.update(reservations).set(value).where(
      eq(reservations.id, id),
    ).returning();
    return updatedReservation;
  }
}