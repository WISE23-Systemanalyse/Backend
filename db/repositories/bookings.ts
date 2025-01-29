import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { bookings, Booking } from "../models/bookings.ts";
import { Show } from "../models/shows.ts";
import { eq } from "drizzle-orm";
import { users } from "../models/users.ts";
import { shows } from "../models/shows.ts";
import { seats } from "../models/seats.ts";
import { payments } from "../models/payments.ts";


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
    async getAllBookingDetails(): Promise<{ booking_id: number, user_id: string, show_id: number, seat_id: number, payment_id: number, booking_time: Date | null, password: string | null, email: string | null, first_name: string | null, last_name: string | null, user_name: string | null, image_url: string | null, movie_id: number | null, hall_id: number | null, start_time: Date | null, row_number: number | null, seat_number: number | null, seat_type: string | null, amount: number | null, payment_time: Date | null, tax: number | null }[]> {
        const booking = await db.select({
            // Booking Details
            booking_id: bookings.id,
            user_id: bookings.user_id,
            show_id: bookings.show_id,
            seat_id: bookings.seat_id,
            payment_id: bookings.payment_id,
            booking_time: bookings.booking_time,
            
            // User Details
            password: users.password,
            email: users.email,
            first_name: users.firstName,
            last_name: users.lastName,
            user_name: users.userName,
            image_url: users.imageUrl,
            
            // Show Details
            movie_id: shows.movie_id,
            hall_id: shows.hall_id,
            start_time: shows.start_time,
            
            // Seat Details
            row_number: seats.row_number,
            seat_number: seats.seat_number,
            seat_type: seats.seat_type,
            
            // Payment Details
            amount: payments.amount,
            payment_time: payments.payment_time,
            tax: payments.tax
          })
          .from(bookings)
          .leftJoin(users, eq(bookings.user_id, users.id))
          .leftJoin(shows, eq(bookings.show_id, shows.id))
          .leftJoin(seats, eq(bookings.seat_id, seats.id))
          .leftJoin(payments, eq(bookings.payment_id, payments.id))
          .execute();
          return booking ?? [];
    }
}

export const bookingRepositoryObj = new BookingRepository();