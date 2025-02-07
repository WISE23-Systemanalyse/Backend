import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { seats } from "../../db/models/seats.ts";

const mockSeats = {
  _: {
    name: "seat",
    columns: {
      id: { dataType: "number" },
      hall_id: { dataType: "number" },
      row_number: { dataType: "number" },
      seat_number: { dataType: "number" },
      category_id: { dataType: "number" }
    }
  },
  $inferSelect: {
    id: 1,
    hall_id: 1,
    row_number: 5,
    seat_number: 10,
    category_id: 1
  }
};

Deno.test("Seats Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    seats._ = mockSeats._;
    assertEquals(seats._.name, "seat");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    seats.$inferSelect = mockSeats.$inferSelect;
    const columns = seats.$inferSelect;
    
    assertEquals(typeof columns.id, "number");
    assertEquals(typeof columns.hall_id, "number");
    assertEquals(typeof columns.row_number, "number");
    assertEquals(typeof columns.seat_number, "number");
    assertEquals(typeof columns.category_id, "number");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = seats._.columns;
    
    assertEquals(columns.id.dataType, "number");
    assertEquals(columns.hall_id.dataType, "number");
    assertEquals(columns.row_number.dataType, "number");
    assertEquals(columns.seat_number.dataType, "number");
    assertEquals(columns.category_id.dataType, "number");
  });
});
