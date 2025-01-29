import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { bookings, Booking } from "../models/bookings.ts";
import { Show } from "../models/shows.ts";
import { eq } from "drizzle-orm";
import { Payment } from "../models/payments.ts";


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
    async getBookingsByUserId(userId: Booking['user_id']): Promise<Booking[]> {
        const userBookings = await db.select().from(bookings).where(eq(bookings["user_id"], userId));
        return userBookings ?? [];
    }
    async getBookingsByPaymentId(paymentId: Payment['id']): Promise<Booking[]> {
        const paymentBookings = await db.select().from(bookings).where(eq(bookings["payment_id"], paymentId));
        return paymentBookings ?? [];
    }
    async getBookingsByToken(token: Booking['token']): Promise<Booking[]> {
        const tokenBookings = await db.select().from(bookings).where(eq(bookings["token"], token));
        return tokenBookings ?? [];
    }
}

export const bookingRepositoryObj = new BookingRepository();