import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { Reservation, reservations } from "../models/reservations.ts";
import { and, eq, gte, lte } from "drizzle-orm";
import { shows } from "../models/shows.ts";
import { seats } from "../models/seats.ts";
import { users } from "../models/users.ts";
import { bookings } from "../models/bookings.ts";
import {
  SeatNotAvailable,
  SeatNotFound,
  ShowNotFound,
  UserNotFound,
} from "../../Errors/index.ts";

const RESERVATION_TIME = 0.9*60*1000

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
    try {
      return await db.transaction(async (tx) => {
        // Check if seat exists
        const seat = await tx.query.seats.findFirst({
          where: eq(seats.id, value.seat_id),
        });
        if (!seat) {
          throw new SeatNotFound();
        }

        // Check if show exists
        const show = await tx.query.shows.findFirst({
          where: eq(shows.id, value.show_id),
        });
        if (!show) {
          throw new ShowNotFound();
        }

        // check if seat is not booked
        const booking = await tx.query.bookings.findFirst({
          where: and(
            eq(bookings.seat_id, value.seat_id),
            eq(bookings.show_id, value.show_id),
          ),
        });

        if (booking) {
          throw new SeatNotAvailable();
        }

        // Check if user exists
        if(value.user_id !== null && value.user_id !== undefined) {
          console.log(value.user_id)  
          const user = await tx.query.users.findFirst({
            where: eq(users.id, value.user_id),
          });
          if (!user) {
            throw new UserNotFound();
          }
        }

        const now = new Date();
        const expireAt = new Date(now.getTime() + RESERVATION_TIME);

        // Check for existing active reservation
        const existingReservation = await tx.query.reservations.findFirst({
          where: and(
            eq(reservations.seat_id, value.seat_id),
            eq(reservations.show_id, value.show_id),
            gte(reservations.expire_at, now),
          ),
        });
        if (existingReservation) {
          throw new SeatNotAvailable();
        }

        // Try to update expired reservation if exists
        const [updatedReservation] = await tx
          .update(reservations)
          .set({
            user_id: value.user_id,
            guest_email: value.guest_email,
            expire_at: expireAt,
          })
          .where(
            and(
              eq(reservations.seat_id, value.seat_id),
              eq(reservations.show_id, value.show_id),
              lte(reservations.expire_at, now),
            ),
          )
          .returning();

        if (updatedReservation) {
          return updatedReservation;
        }

        // Create new reservation if no expired one exists
        try {
          const [newReservation] = await db.insert(reservations)
          .values(
            {
              ...value,
              expire_at: expireAt,
              created_at: now,
            },
          )
            .returning();
          return newReservation;

        } catch (_error: unknown) {
          throw _error
        }
      });
    } catch (e: unknown) {
      throw e;
    }
  }

  async update(
    id: Reservation["id"],
    value: Create<Reservation>,
  ): Promise<Reservation> {
    const [updatedReservation] = await db
      .update(reservations)
      .set(value)
      .where(eq(reservations.id, id))
      .returning();
    return updatedReservation;
  }
}

export const ReservationRepositoryObj = new ReservationRepository();
