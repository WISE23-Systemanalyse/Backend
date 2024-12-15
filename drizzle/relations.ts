import { relations } from "drizzle-orm/relations";
import { show, bookings, seat, users, payments, hall, movie } from "./schema";

export const bookingsRelations = relations(bookings, ({one}) => ({
	show: one(show, {
		fields: [bookings.showId],
		references: [show.id]
	}),
	seat: one(seat, {
		fields: [bookings.seatId],
		references: [seat.id]
	}),
	user: one(users, {
		fields: [bookings.userId],
		references: [users.id]
	}),
	payment: one(payments, {
		fields: [bookings.paymentId],
		references: [payments.id]
	}),
}));

export const showRelations = relations(show, ({one, many}) => ({
	bookings: many(bookings),
	hall: one(hall, {
		fields: [show.hallId],
		references: [hall.id]
	}),
	movie: one(movie, {
		fields: [show.movieId],
		references: [movie.id]
	}),
}));

export const seatRelations = relations(seat, ({one, many}) => ({
	bookings: many(bookings),
	hall: one(hall, {
		fields: [seat.hallId],
		references: [hall.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	bookings: many(bookings),
}));

export const paymentsRelations = relations(payments, ({many}) => ({
	bookings: many(bookings),
}));

export const hallRelations = relations(hall, ({many}) => ({
	seats: many(seat),
	shows: many(show),
}));

export const movieRelations = relations(movie, ({many}) => ({
	shows: many(show),
}));