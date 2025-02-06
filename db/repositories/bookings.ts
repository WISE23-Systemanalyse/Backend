
import { bookings, Booking } from "../models/bookings.ts";
import { Show } from "../models/shows.ts";
import { eq } from "drizzle-orm";
import { users } from "../models/users.ts";
import { shows } from "../models/shows.ts";
import { seats } from "../models/seats.ts";
import { Payment, payments } from "../models/payments.ts";
import { BaseRepository } from "./baseRepository.ts";


export class BookingRepository extends BaseRepository<Booking> {
    constructor() {
        super(bookings);
      }
    async getBookingsByShowId(showId: Show['id']): Promise<Booking[]> {
            const showBookings = await this.db.select().from(bookings).where(eq(bookings["show_id"], showId)) as Booking[];
            return showBookings ?? [];
    }
    async getBookingsByUserId(userId: Booking['user_id']): Promise<Booking[]> {
        if (!userId) return [];
        const userBookings = await this.db.select().from(bookings).where(eq(bookings.user_id, userId)) as Booking[];
        return userBookings ?? [];
    }
    async getBookingsByPaymentId(paymentId: Payment['id']): Promise<Booking[]> {
        const paymentBookings = await this.db.select().from(bookings).where(eq(bookings["payment_id"], paymentId)) as Booking[];
        return paymentBookings ?? [];
    }
    async getAllBookingDetails(): Promise<{ booking_id: number, user_id: string | null, show_id: number, seat_id: number, payment_id: number, booking_time: Date | null, email: string | null, first_name: string | null, last_name: string | null, user_name: string | null, image_url: string | null, movie_id: number | null, hall_id: number | null, start_time: Date | null, base_price: number | null, row_number: number | null, seat_number: number | null, category_id: number | null, amount: number | null, payment_time: Date | null, tax: number | null, payment_method: string | null, payment_status: string | null, time_of_payment: Date | null }[]> {
        const booking = await this.db.select({
            // Booking Details
            booking_id: bookings.id,
            user_id: bookings.user_id,
            show_id: bookings.show_id,
            seat_id: bookings.seat_id,
            payment_id: bookings.payment_id,
            booking_time: bookings.booking_time,
            
            // User Details
            email: users.email,
            first_name: users.firstName,
            last_name: users.lastName,
            user_name: users.userName,
            image_url: users.imageUrl,
            
            // Show Details
            movie_id: shows.movie_id,
            hall_id: shows.hall_id,
            start_time: shows.start_time,
            base_price: shows.base_price,
            
            // Seat Details
            row_number: seats.row_number,
            seat_number: seats.seat_number,
            category_id: seats.category_id,
            
            // Payment Details
            amount: payments.amount,
            payment_time: payments.payment_time,
            tax: payments.tax,
            payment_method: payments.payment_method,
            payment_status: payments.payment_status,
            time_of_payment: payments.time_of_payment
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


