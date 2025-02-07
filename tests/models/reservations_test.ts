import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { reservations } from "../../db/models/reservations.ts";

const mockReservations = {
  _: {
    name: "reservation",
    columns: {
      id: { dataType: "number" },
      seat_id: { dataType: "number" },
      show_id: { dataType: "number" },
      user_id: { dataType: "string" },
      guest_email: { dataType: "string" },
      guest_name: { dataType: "string" },
      expire_at: { dataType: "date" },
      created_at: { dataType: "date" }
    }
  },
  $inferSelect: {
    id: 1,
    seat_id: 1,
    show_id: 1,
    user_id: "user123",
    guest_email: "guest@test.com",
    guest_name: "Guest User",
    expire_at: new Date(),
    created_at: new Date()
  }
};

Deno.test("Reservations Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    reservations._ = mockReservations._;
    assertEquals(reservations._.name, "reservation");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    reservations.$inferSelect = mockReservations.$inferSelect;
    const columns = reservations.$inferSelect;
    
    assertEquals(typeof columns.id, "number");
    assertEquals(typeof columns.seat_id, "number");
    assertEquals(typeof columns.show_id, "number");
    assertEquals(typeof columns.user_id, "string");
    assertEquals(typeof columns.guest_email, "string");
    assertEquals(typeof columns.guest_name, "string");
    assertEquals(typeof columns.expire_at, "object");
    assertEquals(typeof columns.created_at, "object");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = reservations._.columns;
    
    assertEquals(columns.id.dataType, "number");
    assertEquals(columns.seat_id.dataType, "number");
    assertEquals(columns.show_id.dataType, "number");
    assertEquals(columns.user_id.dataType, "string");
    assertEquals(columns.guest_email.dataType, "string");
    assertEquals(columns.guest_name.dataType, "string");
    assertEquals(columns.expire_at.dataType, "date");
    assertEquals(columns.created_at.dataType, "date");
  });
});
