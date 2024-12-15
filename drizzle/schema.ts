import { pgTable, foreignKey, serial, varchar, integer, timestamp, unique, boolean, doublePrecision, time } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const bookings = pgTable("bookings", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	showId: integer("show_id").notNull(),
	seatId: integer("seat_id").notNull(),
	bookingTime: timestamp("booking_time", { mode: 'string' }).defaultNow(),
	paymentId: integer("payment_id").notNull(),
}, (table) => {
	return {
		bookingsShowIdShowIdFk: foreignKey({
			columns: [table.showId],
			foreignColumns: [show.id],
			name: "bookings_show_id_show_id_fk"
		}).onDelete("cascade"),
		bookingsSeatIdSeatIdFk: foreignKey({
			columns: [table.seatId],
			foreignColumns: [seat.id],
			name: "bookings_seat_id_seat_id_fk"
		}).onDelete("cascade"),
		bookingsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "bookings_user_id_users_id_fk"
		}).onDelete("cascade"),
		bookingsPaymentIdPaymentsIdFk: foreignKey({
			columns: [table.paymentId],
			foreignColumns: [payments.id],
			name: "bookings_payment_id_payments_id_fk"
		}).onDelete("cascade"),
	}
});

export const seat = pgTable("seat", {
	id: serial().primaryKey().notNull(),
	hallId: integer("hall_id").notNull(),
	rowNumber: integer("row_number").notNull(),
	seatNumber: integer("seat_number").notNull(),
	seatType: varchar("seat_type", { length: 50 }),
}, (table) => {
	return {
		seatHallIdHallIdFk: foreignKey({
			columns: [table.hallId],
			foreignColumns: [hall.id],
			name: "seat_hall_id_hall_id_fk"
		}).onDelete("cascade"),
	}
});

export const hall = pgTable("hall", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	seatingCapacity: integer("seating_capacity"),
}, (table) => {
	return {
		hallNameUnique: unique("hall_name_unique").on(table.name),
	}
});

export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	password: varchar().notNull(),
	email: varchar().notNull(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	userName: varchar("user_name"),
	imageUrl: varchar("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	isAdmin: boolean("is_admin"),
}, (table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const show = pgTable("show", {
	id: serial().primaryKey().notNull(),
	movieId: varchar("movie_id").notNull(),
	hallId: integer("hall_id").notNull(),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
}, (table) => {
	return {
		showHallIdHallIdFk: foreignKey({
			columns: [table.hallId],
			foreignColumns: [hall.id],
			name: "show_hall_id_hall_id_fk"
		}).onDelete("cascade"),
		showMovieIdMovieIdFk: foreignKey({
			columns: [table.movieId],
			foreignColumns: [movie.id],
			name: "show_movie_id_movie_id_fk"
		}).onDelete("cascade"),
	}
});

export const payments = pgTable("payments", {
	id: serial().primaryKey().notNull(),
	amount: doublePrecision().notNull(),
	paymentTime: time("payment_time").defaultNow(),
	tax: doublePrecision().notNull(),
});

export const movie = pgTable("movie", {
	id: varchar().primaryKey().notNull(),
	title: varchar().notNull(),
	year: integer().notNull(),
	imageUrl: varchar("image_url").notNull(),
}, (table) => {
	return {
		movieTitleUnique: unique("movie_title_unique").on(table.title),
	}
});
