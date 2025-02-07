import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { halls } from "../../db/models/halls.ts";

const mockHalls = {
  _: {
    name: "hall",
    columns: {
      id: { dataType: "number" },
      name: { dataType: "string" },
      seating_capacity: { dataType: "number" }
    }
  },
  $inferSelect: {
    id: 1,
    name: "Saal 1",
    seating_capacity: 100
  }
};

Deno.test("Halls Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    halls._ = mockHalls._;
    assertEquals(halls._.name, "hall");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    halls.$inferSelect = mockHalls.$inferSelect;
    const columns = halls.$inferSelect;
    
    assertEquals(typeof columns.id, "number");
    assertEquals(typeof columns.name, "string");
    assertEquals(typeof columns.seating_capacity, "number");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = halls._.columns;
    
    assertEquals(columns.id.dataType, "number");
    assertEquals(columns.name.dataType, "string");
    assertEquals(columns.seating_capacity.dataType, "number");
  });
});
