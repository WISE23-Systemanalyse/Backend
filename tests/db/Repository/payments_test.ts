import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { PaymentRepository } from "../../../db/repositories/payments.ts";
import { db } from "../../../db/db.ts";
import { Payment } from "../../../db/models/payments.ts";

// Mock data for tests
const mockPayments: Payment[] = [
  { 
    id: 1,
    amount: 19.99,
    payment_time: new Date('2024-03-20T18:00:00'),
    tax: 3.99,
    payment_method: 'credit_card',
    payment_status: 'completed',
    time_of_payment: new Date('2024-03-20T18:00:00')
  },
  { 
    id: 2,
    amount: 29.99,
    payment_time: new Date('2024-03-20T19:00:00'),
    tax: 5.99,
    payment_method: 'paypal',
    payment_status: 'pending',
    time_of_payment: new Date('2024-03-20T19:00:00')
  }
];

Deno.test('PaymentRepository - findAll', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => mockPayments
  }) as any;

  try {
    const repository = new PaymentRepository();
    const result = await repository.findAll();

    assertExists(result);
    assertEquals(result.length, 2);
    assertEquals(result[0].amount, 19.99);
    assertEquals(result[0].payment_status, 'completed');
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('PaymentRepository - find by id', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => ({
      where: () => [mockPayments[0]]
    })
  }) as any;

  try {
    const repository = new PaymentRepository();
    const result = await repository.find(1);

    assertExists(result);
    assertEquals(result.payment_time, new Date('2024-03-20T18:00:00'));
    assertEquals(result.payment_method, 'credit_card');
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('PaymentRepository - create', async () => {
  const testDate = new Date('2024-03-20T18:00:00');
  const newPayment = {
    amount: 39.99,
    payment_time: testDate,
    tax: 7.99,
    payment_method: 'credit_card',
    payment_status: 'pending',
    time_of_payment: testDate
  };
  
  const originalInsert = db.insert;
  db.insert = () => ({
    values: () => ({
      returning: () => [{
        id: 3,
        ...newPayment,
        payment_time: testDate,
        time_of_payment: testDate
      }]
    })
  }) as any;

  try {
    const repository = new PaymentRepository();
    const result = await repository.create(newPayment);

    assertExists(result);
    assertEquals(result.payment_time, testDate);
    assertEquals(result.amount, 39.99);
    assertEquals(result.payment_status, 'pending');
  } finally {
    db.insert = originalInsert;
  }
});

Deno.test('PaymentRepository - update', async () => {
  const testDate = new Date('2024-03-20T18:00:00');
  const updatedPayment = {
    amount: 49.99,
    payment_time: testDate,
    tax: 8.99,
    payment_method: 'credit_card',
    payment_status: 'completed',
    time_of_payment: testDate
  };
  
  const originalUpdate = db.update;
  db.update = () => ({
    set: () => ({
      where: () => ({
        returning: () => [{
          id: 1,
          ...updatedPayment
        }]
      })
    })
  }) as any;

  try {
    const repository = new PaymentRepository();
    const result = await repository.update(1, updatedPayment);

    assertExists(result);
    assertEquals(result.amount, 49.99);
    assertEquals(result.payment_status, 'completed');
  } finally {
    db.update = originalUpdate;
  }
});

Deno.test('PaymentRepository - delete', async () => {
  const originalDelete = db.delete;
  db.delete = () => ({
    where: () => Promise.resolve()
  }) as any;

  try {
    const repository = new PaymentRepository();
    await repository.delete(1);
    // If no error is thrown, the test passes
  } finally {
    db.delete = originalDelete;
  }
});
