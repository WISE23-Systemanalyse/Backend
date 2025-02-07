import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { CategoryRepository } from "../../../db/repositories/categories.ts";
import { db } from "../../../db/db.ts";
import { Category } from "../../../db/models/categories.ts";

// Mock-Daten für Tests
const mockCategories: Category[] = [
  { id: 1, category_name: "Action", surcharge: 2.50 },
  { id: 2, category_name: "Comedy", surcharge: null }
];


Deno.test('CategoryRepository - find by id', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      where: () => [mockCategories[0]]
    })
  }) as any;

  try {
    const repository = new CategoryRepository();
    const result = await repository.find(1);

    assertExists(result);
    assertEquals(result.category_name, "Action");
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('CategoryRepository - findByName', async () => {
  const originalQuery = db.query.categories.findFirst;
  db.query.categories.findFirst = () => mockCategories[0] as any;

  try {
    const repository = new CategoryRepository();
    const result = await repository.findByName("Action");

    assertExists(result);
    assertEquals(result.category_name, "Action");
  } finally {
    db.query.categories.findFirst = originalQuery;
  }
});

Deno.test('CategoryRepository - create', async () => {
  const newCategory = { category_name: "Horror", surcharge: null };
  
  const originalInsert = db.insert;
  db.insert = () => ({
    values: () => ({
      returning: () => [{ ...newCategory, id: 3 }]
    })
  }) as any;

  try {
    const repository = new CategoryRepository();
    const result = await repository.create(newCategory);

    assertExists(result);
    assertEquals(result.category_name, "Horror");
    assertExists(result.id);
  } finally {
    db.insert = originalInsert;
  }
});

Deno.test('CategoryRepository - update', async () => {
  const updatedCategory = { category_name: "Sci-Fi", surcharge: 1.50 };
  
  const originalUpdate = db.update;
  db.update = () => ({
    set: () => ({
      where: () => ({
        returning: () => [{ ...updatedCategory, id: 1 }]
      })
    })
  }) as any;

  try {
    const repository = new CategoryRepository();
    const result = await repository.update(1, updatedCategory);

    assertExists(result);
    assertEquals(result.category_name, "Sci-Fi");
  } finally {
    db.update = originalUpdate;
  }
});

Deno.test('CategoryRepository - delete', async () => {
  const originalDelete = db.delete;
  db.delete = () => ({
    where: () => Promise.resolve()
  }) as any;

  try {
    const repository = new CategoryRepository();
    await repository.delete(1);
    // Wenn kein Fehler geworfen wird, ist der Test erfolgreich
  } finally {
    db.delete = originalDelete;
  }
});
