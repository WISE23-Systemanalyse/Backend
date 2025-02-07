import { assertEquals, assertExists, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { ReservationRepository } from "../../../db/repositories/reservations.ts";
import { db } from "../../../db/db.ts";
import { Reservation } from "../../../db/models/reservations.ts";
import { SeatNotAvailable, SeatNotFound, ShowNotFound } from "../../../Errors/index.ts";

// Mock data for tests
const mockReservations: Reservation[] = [
  { 
    id: 1,
    show_id: 1,
    seat_id: 1,
    user_id: '1',
    guest_email: null,
    guest_name: null,
    expire_at: new Date('2024-03-20T18:10:00'),
    created_at: new Date('2024-03-20T18:00:00')
  },
  { 
    id: 2,
    show_id: 1,
    seat_id: 2,
    user_id: null,
    guest_email: 'guest@test.com',
    guest_name: 'Guest User',
    expire_at: new Date('2024-03-20T18:10:00'),
    created_at: new Date('2024-03-20T18:00:00')
  }
];

Deno.test('ReservationRepository - findByShowId', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      where: () => mockReservations.filter(r => r.show_id === 1)
    })
  }) as any;

  try {
    const repository = new ReservationRepository();
    const result = await repository.findByShowId(1);

    assertExists(result);
    assertEquals(result.length, 2);
    assertEquals(result[0].show_id, 1);
    assertEquals(result[1].guest_email, 'guest@test.com');
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('ReservationRepository - create success with user', async () => {
  const newReservation = {
    show_id: 1,
    seat_id: 3,
    user_id: '1',
    guest_email: null,
    guest_name: null,
    created_at: new Date(),
    expire_at: new Date(Date.now() + 10*60*1000)  // 10 minutes from now
  };

  const mockTransaction = async (callback: (tx: any) => Promise<any>) => {
    const mockTx = {
      query: {
        seats: { findFirst: () => ({ id: 3 }) },
        shows: { findFirst: () => ({ id: 1 }) },
        users: { findFirst: () => ({ id: '1' }) },
        bookings: { findFirst: () => null },
        reservations: { findFirst: () => null }
      },
      insert: () => ({
        values: () => ({
          returning: () => [{
            id: 3,
            ...newReservation,
            expire_at: new Date(),
            created_at: new Date()
          }]
        })
      }),
      update: () => ({
        set: () => ({
          where: () => ({
            returning: () => []
          })
        })
      })
    };
    return await callback(mockTx);
  };

  const originalTransaction = db.transaction;
  db.transaction = mockTransaction as any;

  try {
    const repository = new ReservationRepository();
    const result = await repository.create(newReservation);

    assertExists(result);
    assertEquals(result.show_id, 1);
    assertEquals(result.seat_id, 3);
    assertEquals(result.user_id, '1');
  } finally {
    db.transaction = originalTransaction;
  }
});

Deno.test('ReservationRepository - create success with guest', async () => {
  const newReservation = {
    show_id: 1,
    seat_id: 3,
    user_id: null,
    guest_email: 'guest@test.com',
    guest_name: null,
    created_at: new Date(),
    expire_at: new Date(Date.now() + 10*60*1000)  // 10 minutes from now
  };

  const mockTransaction = async (callback: (tx: any) => Promise<any>) => {
    const mockTx = {
      query: {
        seats: { findFirst: () => ({ id: 3 }) },
        shows: { findFirst: () => ({ id: 1 }) },
        bookings: { findFirst: () => null },
        reservations: { findFirst: () => null }
      },
      insert: () => ({
        values: () => ({
          returning: () => [{
            id: 3,
            ...newReservation,
            expire_at: new Date(),
            created_at: new Date()
          }]
        })
      }),
      update: () => ({
        set: () => ({
          where: () => ({
            returning: () => []
          })
        })
      })
    };
    return await callback(mockTx);
  };

  const originalTransaction = db.transaction;
  db.transaction = mockTransaction as any;

  try {
    const repository = new ReservationRepository();
    const result = await repository.create(newReservation);

    assertExists(result);
    assertEquals(result.guest_email, 'guest@test.com');
  } finally {
    db.transaction = originalTransaction;
  }
});

Deno.test('ReservationRepository - create fails with seat not found', async () => {
  const newReservation = {
    show_id: 1,
    seat_id: 999,
    user_id: '1',
    guest_email: null,
    guest_name: null,
    created_at: new Date(),
    expire_at: new Date(Date.now() + 10*60*1000)  // 10 minutes from now
  };

  const mockTransaction = async (callback: (tx: any) => Promise<any>) => {
    const mockTx = {
      query: {
        seats: { findFirst: () => null },
      }
    };
    return await callback(mockTx);
  };

  const originalTransaction = db.transaction;
  db.transaction = mockTransaction as any;

  try {
    const repository = new ReservationRepository();
    await assertRejects(
      async () => await repository.create(newReservation),
      Error,
      'Seat not Found'
    );
  } finally {
    db.transaction = originalTransaction;
  }
});

Deno.test('ReservationRepository - create fails with show not found', async () => {
  const newReservation = {
    show_id: 999,
    seat_id: 1,
    user_id: '1',
    guest_email: null,
    guest_name: null,
    created_at: new Date(),
    expire_at: new Date(Date.now() + 10*60*1000)  // 10 minutes from now
  };

  const mockTransaction = async (callback: (tx: any) => Promise<any>) => {
    const mockTx = {
      query: {
        seats: { findFirst: () => ({ id: 1 }) },
        shows: { findFirst: () => null }
      }
    };
    return await callback(mockTx);
  };

  const originalTransaction = db.transaction;
  db.transaction = mockTransaction as any;

  try {
    const repository = new ReservationRepository();
    await assertRejects(
      async () => await repository.create(newReservation),
      Error,
      'Show not Found'
    );
  } finally {
    db.transaction = originalTransaction;
  }
});

Deno.test('ReservationRepository - create fails with seat not available', async () => {
  const newReservation = {
    show_id: 1,
    seat_id: 1,
    user_id: '1',
    guest_email: null,
    guest_name: null,
    created_at: new Date(),
    expire_at: new Date(Date.now() + 10*60*1000)
  };

  const mockTransaction = async (callback: (tx: any) => Promise<any>) => {
    const mockTx = {
      query: {
        seats: { findFirst: () => ({ id: 1 }) },
        shows: { findFirst: () => ({ id: 1 }) },
        users: { findFirst: () => ({ id: '1' }) },
        bookings: { findFirst: () => null },
        reservations: { 
          findFirst: () => ({ 
            id: 1, 
            expire_at: new Date(Date.now() + 1000000) // Zukunftsdatum
          }) 
        }
      }
    };
    return await callback(mockTx);
  };

  const originalTransaction = db.transaction;
  db.transaction = mockTransaction as any;

  try {
    const repository = new ReservationRepository();
    await assertRejects(
      async () => await repository.create(newReservation),
      Error,
      'Seat is not available'
    );
  } finally {
    db.transaction = originalTransaction;
  }
});

Deno.test('ReservationRepository - update', async () => {
  const updatedReservation = {
    show_id: 1,
    seat_id: 1,
    user_id: '2',
    guest_email: null,
    guest_name: null,
    created_at: new Date(),
    expire_at: new Date(Date.now() + 10*60*1000)  // 10 minutes from now
  };
  
  const originalUpdate = db.update;
  db.update = () => ({
    set: () => ({
      where: () => ({
        returning: () => [{
          id: 1,
          ...updatedReservation,
          expire_at: new Date(),
          created_at: new Date()
        }]
      })
    })
  }) as any;

  try {
    const repository = new ReservationRepository();
    const result = await repository.update(1, updatedReservation);

    assertExists(result);
    assertEquals(result.user_id, '2');
  } finally {
    db.update = originalUpdate;
  }
});
