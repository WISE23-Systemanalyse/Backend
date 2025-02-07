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
  payment_id: "payment1",
  created_at: new Date(),
  guest_email: null,
  guest_name: null
};

// Mock DB Instanz
const mockDb = {
  select: () => ({
    from: function(table: any) {
      return {
        where: () => [mockBooking],
        // Für findAll, wenn where nicht aufgerufen wird
        ...([mockBooking])
      };
    }
  }),
  insert: () => ({
    values: () => ({
      returning: () => [{ ...mockBooking, id: 2, user_id: "user2" }]
    })
  }),
  query: {
    select: () => ({
      from: () => ({
        where: () => [mockBooking]
      })
    })
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
});
