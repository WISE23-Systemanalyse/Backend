import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { SeatRepository } from "../../../db/repositories/seats.ts";
import { db } from "../../../db/db.ts";
import { Seat } from "../../../db/models/seats.ts";

// Mock data for tests
const mockSeats: Seat[] = [
  { id: 1, hall_id: 1, row_number: 1, seat_number: 1, category_id: 1 },
  { id: 2, hall_id: 1, row_number: 1, seat_number: 2, category_id: 1 },
  { id: 3, hall_id: 2, row_number: 1, seat_number: 1, category_id: 2 }
];

Deno.test('SeatRepository - find by id', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      where: () => [mockSeats[0]]
    })
  }) as any;

  try {
    const repository = new SeatRepository();
    const result = await repository.find(1);

    assertExists(result);
    assertEquals(result.hall_id, 1);
    assertEquals(result.row_number, 1);
    assertEquals(result.seat_number, 1);
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('SeatRepository - findByHallId', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      where: () => ({
        orderBy: () => mockSeats.filter(seat => seat.hall_id === 1)
      })
    })
  }) as any;

  try {
    const repository = new SeatRepository();
    const result = await repository.findByHallId(1);

    assertExists(result);
    assertEquals(result.length, 2);
    assertEquals(result[0].hall_id, 1);
    assertEquals(result[1].hall_id, 1);
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('SeatRepository - create', async () => {
  const newSeat = { hall_id: 3, row_number: 1, seat_number: 1, category_id: 1 };
  
  const originalInsert = db.insert;
  db.insert = () => ({
    values: () => ({
      returning: () => [{ ...newSeat, id: 4 }]
    })
  }) as any;

  try {
    const repository = new SeatRepository();
    const result = await repository.create(newSeat);

    assertExists(result);
    assertEquals(result.hall_id, 3);
    assertEquals(result.row_number, 1);
    assertEquals(result.seat_number, 1);
    assertExists(result.id);
  } finally {
    db.insert = originalInsert;
  }
});

Deno.test('SeatRepository - update', async () => {
  const updatedSeat = { hall_id: 1, row_number: 2, seat_number: 3, category_id: 1 };
  
  const originalUpdate = db.update;
  db.update = () => ({
    set: () => ({
      where: () => ({
        returning: () => [{ ...updatedSeat, id: 1 }]
      })
    })
  }) as any;

  try {
    const repository = new SeatRepository();
    const result = await repository.update(1, updatedSeat);

    assertExists(result);
    assertEquals(result.row_number, 2);
    assertEquals(result.seat_number, 3);
  } finally {
    db.update = originalUpdate;
  }
});

Deno.test('SeatRepository - delete', async () => {
  const originalDelete = db.delete;
  db.delete = () => ({
    where: () => Promise.resolve()
  }) as any;

  try {
    const repository = new SeatRepository();
    await repository.delete(1);
    // If no error is thrown, the test is successful
  } finally {
    db.delete = originalDelete;
  }
});

Deno.test('SeatRepository - deleteByHallId', async () => {
  const originalDelete = db.delete;
  db.delete = () => ({
    where: () => Promise.resolve()
  }) as any;

  try {
    const repository = new SeatRepository();
    await repository.deleteByHallId(1);
    // If no error is thrown, the test is successful
  } finally {
    db.delete = originalDelete;
  }
});
