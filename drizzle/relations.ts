import { relations } from "drizzle-orm/relations";
import { users, bookings, show, seat, movie, hall } from "./schema";

export const bookingsRelations = relations(bookings, ({one}) => ({
	user: one(users, {
		fields: [bookings.userId],
		references: [users.id]
	}),
	show: one(show, {
		fields: [bookings.showId],
		references: [show.id]
	}),
	seat: one(seat, {
		fields: [bookings.seatId],
		references: [seat.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	bookings: many(bookings),
}));

export const showRelations = relations(show, ({one, many}) => ({
	bookings: many(bookings),
	movie: one(movie, {
		fields: [show.movieId],
		references: [movie.id]
	}),
	hall: one(hall, {
		fields: [show.hallId],
		references: [hall.id]
	}),
}));

export const seatRelations = relations(seat, ({one, many}) => ({
	bookings: many(bookings),
	hall: one(hall, {
		fields: [seat.hallId],
		references: [hall.id]
	}),
}));

export const movieRelations = relations(movie, ({many}) => ({
	shows: many(show),
}));

export const hallRelations = relations(hall, ({many}) => ({
	shows: many(show),
	seats: many(seat),
}));