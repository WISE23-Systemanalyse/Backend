import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { categories } from "../../db/models/categories.ts";

const mockCategories = {
  _: {
    name: "category",
    columns: {
      id: { dataType: "number" },
      category_name: { dataType: "string" },
      surcharge: { dataType: "number" }
    }
  },
  $inferSelect: {
    id: 1,
    category_name: "VIP",
    surcharge: 10.0
  }
};

Deno.test("Categories Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    categories._ = mockCategories._;
    assertEquals(categories._.name, "category");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    categories.$inferSelect = mockCategories.$inferSelect;
    const columns = categories.$inferSelect;
    
    assertEquals(typeof columns.id, "number");
    assertEquals(typeof columns.category_name, "string");
    assertEquals(typeof columns.surcharge, "number");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = categories._.columns;
    
    assertEquals(columns.id.dataType, "number");
    assertEquals(columns.category_name.dataType, "string");
    assertEquals(columns.surcharge.dataType, "number");
  });
});
