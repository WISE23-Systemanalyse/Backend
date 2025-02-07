import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { BaseRepository } from "../../../db/repositories/baseRepository.ts";
import { db } from "../../../db/db.ts";

// Mock table for testing
const mockTable = {
  id: 'id',
};

// Definiere Interface für Test-Item
interface TestItem {
  id: number;
  name: string;
}

// Übergebe TestItem als Typ-Parameter
const repository = new BaseRepository<TestItem>(mockTable);

// Aktualisiere mockData Typisierung
const mockData: TestItem[] = [
  { id: 1, name: 'Test Item 1' },
  { id: 2, name: 'Test Item 2' }
];

Deno.test('BaseRepository - findAll', async () => {
  // Temporarily replace db.select method
  const originalSelect = db.select;
  db.select = () => ({
    from: () => mockData
  }) as any;

  try {
    const result = await repository.findAll();

    assertEquals(result.length, 2);
    assertEquals(result[0].name, 'Test Item 1');
  } finally {
    // Restore original method
    db.select = originalSelect;
  }
});

Deno.test('BaseRepository - find existing item', async () => {
  // Temporarily replace db.select method
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      where: () => [mockData[0]]
    })
  }) as any;

  try {
    const result = await repository.find(1);

    assertExists(result);
    assertEquals(result.name, 'Test Item 1');
  } finally {
    // Restore original method
    db.select = originalSelect;
  }
});

Deno.test('BaseRepository - find non-existing item', async () => {
  // Temporarily replace db.select method
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      where: () => []
    })
  }) as any;

  try {
    const result = await repository.find(999);

    assertEquals(result, null);
  } finally {
    // Restore original method
    db.select = originalSelect;
  }
});

Deno.test('BaseRepository - create', async () => {
  const newItem = { name: 'New Item' };
  
  // Temporarily replace db.insert method
  const originalInsert = db.insert;
  db.insert = () => ({
    values: () => ({
      returning: () => [{ ...newItem, id: 3 }]
    })
  }) as any;

  try {
    const result = await repository.create(newItem);

    assertExists(result);
    assertEquals(result.name, 'New Item');
    assertExists(result.id);
  } finally {
    // Restore original method
    db.insert = originalInsert;
  }
});

Deno.test('BaseRepository - update', async () => {
  const updatedItem = { name: 'Updated Item' };
  
  // Temporarily replace db.update method
  const originalUpdate = db.update;
  db.update = () => ({
    set: () => ({
      where: () => ({
        returning: () => [{ ...updatedItem, id: 1 }]
      })
    })
  }) as any;

  try {
    const result = await repository.update(1, updatedItem);

    assertExists(result);
    assertEquals(result.name, 'Updated Item');
  } finally {
    // Restore original method
    db.update = originalUpdate;
  }
});

Deno.test('BaseRepository - delete', async () => {
  // Temporarily replace db.delete method
  const originalDelete = db.delete;
  db.delete = () => ({
    where: () => Promise.resolve()
  }) as any;

  try {
    await repository.delete(1);
    // If no error is thrown, the test passes
  } finally {
    // Restore original method
    db.delete = originalDelete;
  }
});