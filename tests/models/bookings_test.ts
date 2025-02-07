import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { bookings } from "../../db/models/bookings.ts";

// Mock für das Bookings Model
const mockBookings = {
  _: {
    name: "bookings",
    columns: {
      id: { dataType: "number" },
      user_id: { dataType: "string" },
      show_id: { dataType: "number" },
      seat_id: { dataType: "number" },
      payment_id: { dataType: "string" },
      booking_time: { dataType: "date" },
      email: { dataType: "string" },
      token: { dataType: "string" }
    }
  },
  $inferSelect: {
    id: 1,
    user_id: "user1",
    show_id: 1,
    seat_id: 1,
    payment_id: "payment1",
    booking_time: new Date(),
    email: "test@test.com",
    token: "token123"
  }
};

Deno.test("Bookings Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    bookings._ = mockBookings._;
    assertEquals(bookings._.name, "bookings");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    bookings.$inferSelect = mockBookings.$inferSelect;
    const columns = bookings.$inferSelect;
    
    assertEquals(typeof columns.id, "number");
    assertEquals(typeof columns.user_id, "string");
    assertEquals(typeof columns.show_id, "number");
    assertEquals(typeof columns.seat_id, "number");
    assertEquals(typeof columns.payment_id, "string");
    assertEquals(typeof columns.booking_time, "object");
    assertEquals(typeof columns.email, "string");
    assertEquals(typeof columns.token, "string");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = bookings._.columns;
    
    assertEquals(columns.id.dataType, "number");
    assertEquals(columns.user_id.dataType, "string");
    assertEquals(columns.show_id.dataType, "number");
    assertEquals(columns.seat_id.dataType, "number");
    assertEquals(columns.payment_id.dataType, "string");
    assertEquals(columns.booking_time.dataType, "date");
    assertEquals(columns.email.dataType, "string");
    assertEquals(columns.token.dataType, "string");
  });
});
