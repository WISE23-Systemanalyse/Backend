import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { CategoryRepository } from "../../../db/repositories/categories.ts";
import { mockCategories } from "../../mocks/categoryRepositoryMocks.ts";


Deno.test("CategoryRepository.findByName should return category", async () => {
  const mockDb = {
    select: () => mockDb,
    from: () => mockDb,
    where: () => Promise.resolve([mockCategories[0]]),
    query: {
      categories: {
        findFirst: () => Promise.resolve(mockCategories[0])
      }
    }
  };

  const repository = new CategoryRepository();
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  const result = await repository.findByName("Test Category");
  assertEquals(result, mockCategories[0]);
});

Deno.test("CategoryRepository.findByName should return null if not found", async () => {
  const mockDb = {
    select: () => mockDb,
    from: () => mockDb,
    where: () => Promise.resolve([]),
    query: {
      categories: {
        findFirst: () => Promise.resolve(null)
      }
    }
  };

  // @ts-ignore - Wir überschreiben den DB-Parameter für Tests
    const repository = new CategoryRepository();
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  const result = await repository.findByName("Non-existent Category");
  assertEquals(result, null);
});
