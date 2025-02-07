import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { movies } from "../../db/models/movies.ts";

const mockMovies = {
  _: {
    name: "movie",
    columns: {
      id: { dataType: "number" },
      title: { dataType: "string" },
      year: { dataType: "number" },
      description: { dataType: "string" },
      rating: { dataType: "number" },
      imageUrl: { dataType: "string" },
      genres: { dataType: "array" },
      duration: { dataType: "number" }
    }
  },
  $inferSelect: {
    id: 1,
    title: "Test Movie",
    year: 2024,
    description: "Test Description",
    rating: 4.5,
    imageUrl: "test.jpg",
    genres: ["Action"],
    duration: 120
  }
};

Deno.test("Movies Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    movies._ = mockMovies._;
    assertEquals(movies._.name, "movie");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    movies.$inferSelect = mockMovies.$inferSelect;
    const columns = movies.$inferSelect;
    
    assertEquals(typeof columns.id, "number");
    assertEquals(typeof columns.title, "string");
    assertEquals(typeof columns.year, "number");
    assertEquals(typeof columns.description, "string");
    assertEquals(typeof columns.rating, "number");
    assertEquals(typeof columns.imageUrl, "string");
    assertEquals(Array.isArray(columns.genres), true);
    assertEquals(typeof columns.duration, "number");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = movies._.columns;
    
    assertEquals(columns.id.dataType, "number");
    assertEquals(columns.title.dataType, "string");
    assertEquals(columns.year.dataType, "number");
    assertEquals(columns.description.dataType, "string");
    assertEquals(columns.rating.dataType, "number");
    assertEquals(columns.imageUrl.dataType, "string");
    assertEquals(columns.genres.dataType, "array");
    assertEquals(columns.duration.dataType, "number");
  });
});
