import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { bookings, Booking } from "../models/bookings.ts";
import { Show } from "../models/shows.ts";
import { eq } from "drizzle-orm";


export class BookingRepository implements Repository<Booking> {
    async findAll(): Promise<Booking[]> {
        const allBookings = await db.select().from(bookings);
        return allBookings;
    }
    async find(id: Booking['id']): Promise< Booking | null> {
        const result = await db.query.bookings.findFirst({
            where: eq(bookings.id, id),
          });
          return result ?? null;
    }
    async delete(id: Booking['id']): Promise<void> {
        await db.delete(bookings).where(eq(bookings.id, id));
    }
    async create(value: Create<Booking>): Promise<Booking> {
      const [booking] = await db.insert(bookings).values(value).returning();
      return booking;
    }
    async update(id: Booking['id'], value: Create<Booking>): Promise<Booking> {
        const [updatedBooking] = await db.update(bookings).set(value).where(eq(bookings.id, id)).returning();
        return updatedBooking;
    }
    async getBookingsByShowId(showId: Show['id']): Promise<Booking[]> {
            const showBookings = await db.select().from(bookings).where(eq(bookings["show_id"], showId));
            return showBookings ?? [];
    }
}

export const bookingRepository = new BookingRepository();