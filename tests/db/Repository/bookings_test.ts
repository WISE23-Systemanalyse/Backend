import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { bookingRepositoryObj } from "../../../db/repositories/bookings.ts";
import { db } from "../../../db/db.ts";
import { eq } from "drizzle-orm";

// Mock für die Datenbank-Queries
const mockBooking = {
  id: 1,
  user_id: "user1",
  show_id: 1,
  seat_id: 1,
  payment_id: 1,
  created_at: new Date(),
  guest_email: null,
  guest_name: null,
  movie_id: 1,
  hall_id: 1,
  category_id: 1,
  payment_method: "PayPal",
  payment_status: "completed",
  payment_time: new Date()
};

// Mock DB Instanz
const mockDb = {
  insert: () => ({
    values: () => ({
      returning: () => [{ ...mockBooking, id: 2, user_id: "user2" }]
    })
  }),
  select: function(...args: any[]) {
    // Prüfe ob es ein komplexer Query mit Joins ist
    if (args.length > 0) {
      return {
        from: function() {
          return {
            where: function() {
              return this;
            },
            leftJoin: function() {
              return this;
            },
            execute: async function() {
              return [mockDetailedBooking];
            }
          };
        }
      };
    }
    // Einfache Queries ohne Joins
    return {
      from: function(table: any) {
        return {
          where: () => [mockBooking],
          ...([mockBooking])
        };
      }
    };
  }
};

// Mock für detaillierte Buchungen
const mockDetailedBooking = {
  ...mockBooking,
  show: {
    id: 1,
    movie_id: 1,
    hall_id: 1,
    start_time: new Date(),
    base_price: 10
  },
  seat: {
    id: 1,
    hall_id: 1,
    row_number: 1,
    seat_number: 1,
    category_id: 1
  },
  payment: {
    id: 1,
    amount: 10,
    tax: 1.9,
    payment_method: "PayPal",
    payment_status: "completed",
    payment_time: new Date()
  }
};

Deno.test("Bookings Repository Tests", async (t) => {
  await t.step("setup", () => {
    // @ts-ignore - Mock db
    db.select = mockDb.select;
    // @ts-ignore - Mock db
    db.insert = mockDb.insert;
    // @ts-ignore - Mock db
    db.query = mockDb.query;
  });

  await t.step("sollte eine Buchung nach ID finden", async () => {
    const booking = await bookingRepositoryObj.find(1);
    assertEquals(booking?.id, 1);
    assertEquals(booking?.user_id, "user1");
  });

  await t.step("sollte alle Buchungen finden", async () => {
    const bookings = await bookingRepositoryObj.findAll();
    assertEquals(bookings[0].id, 1);
  });

  await t.step("sollte Buchungen nach ShowId finden", async () => {
    const bookings = await bookingRepositoryObj.getBookingsByShowId(1);

    assertEquals(bookings.length, 1);
    assertEquals(bookings[0].show_id, 1);
  });

  await t.step("sollte Buchungen nach UserId finden", async () => {
    const bookings = await bookingRepositoryObj.getBookingsByUserId("user1");
    assertEquals(bookings.length, 1);
    assertEquals(bookings[0].user_id, "user1");
  });

  await t.step("sollte eine neue Buchung erstellen", async () => {
    // Mock für db.query.insertInto
    // @ts-ignore - Mock query
    db.query = async () => [{
      ...mockBooking,
      id: 2,
      user_id: "user2"
    }];

    const newBooking = {
      email: "test@example.com",
      token: "test-token",
      id: 2,
      user_id: "user2",
      show_id: 2,
      seat_id: 2,
      booking_time: new Date(),
      payment_id: "payment2",
    };

    const result = await bookingRepositoryObj.create({
      ...newBooking,
      payment_id: 2 // Convert payment_id to number to match type
    });
    assertEquals(result.id, 2);
    assertEquals(result.user_id, "user2");
  });

  await t.step("sollte Buchungen nach PaymentId finden", async () => {
    // @ts-ignore - Mock query
    db.query = async () => [mockDetailedBooking];

    const bookings = await bookingRepositoryObj.getBookingsByPaymentId(1);
    
    assertEquals(bookings.length, 1);
    assertEquals(bookings[0].payment_id, 1);
    assertEquals(bookings[0].show_id, 1);
    assertEquals(bookings[0].seat_id, 1);
  });

  await t.step("sollte alle Buchungsdetails finden", async () => {
    const bookings = await bookingRepositoryObj.getAllBookingDetails();
    
    assertEquals(bookings.length, 1);
    assertEquals(bookings[0].movie_id, 1);
    assertEquals(bookings[0].hall_id, 1);
    assertEquals(bookings[0].category_id, 1);
    assertEquals(bookings[0].payment_method, "PayPal");
  });

  await t.step("sollte ein Array mit einer Buchungen zurückgeben", async () => {
    // @ts-ignore - Mock query
    db.query = async () => [];

    const bookings = await bookingRepositoryObj.getAllBookingDetails();

    assertEquals(bookings.length, 1);
  });

  await t.step("sollte mit fehlenden Beziehungen umgehen können", async () => {
    const mockIncompleteBooking = {
      ...mockBooking,
      show: null,
      seat: null,
      payment: null
    };

    // @ts-ignore - Mock query
    db.query = async () => [mockIncompleteBooking];

    const bookings = await bookingRepositoryObj.getAllBookingDetails();
    
    assertEquals(bookings.length, 1);
    assertEquals(bookings[0].start_time, undefined);
    assertEquals(bookings[0].row_number, undefined);
    assertEquals(bookings[0].seat_number, undefined);
    assertEquals(bookings[0].time_of_payment, undefined);
  });
});
