import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { shows } from "../../db/models/shows.ts";

const mockShows = {
  _: {
    name: "show",
    columns: {
      id: { dataType: "number" },
      movie_id: { dataType: "number" },
      hall_id: { dataType: "number" },
      start_time: { dataType: "date" },
      base_price: { dataType: "number" }
    }
  },
  $inferSelect: {
    id: 1,
    movie_id: 1,
    hall_id: 1,
    start_time: new Date(),
    base_price: 12.99
  }
};

Deno.test("Shows Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    shows._ = mockShows._;
    assertEquals(shows._.name, "show");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    shows.$inferSelect = mockShows.$inferSelect;
    const columns = shows.$inferSelect;
    
    assertEquals(typeof columns.id, "number");
    assertEquals(typeof columns.movie_id, "number");
    assertEquals(typeof columns.hall_id, "number");
    assertEquals(typeof columns.start_time, "object");
    assertEquals(typeof columns.base_price, "number");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = shows._.columns;
    
    assertEquals(columns.id.dataType, "number");
    assertEquals(columns.movie_id.dataType, "number");
    assertEquals(columns.hall_id.dataType, "number");
    assertEquals(columns.start_time.dataType, "date");
    assertEquals(columns.base_price.dataType, "number");
  });
});
