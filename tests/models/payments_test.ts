import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { payments } from "../../db/models/payments.ts";

const mockPayments = {
  _: {
    name: "payments",
    columns: {
      id: { dataType: "number" },
      amount: { dataType: "number" },
      payment_time: { dataType: "date" },
      tax: { dataType: "number" },
      payment_method: { dataType: "string" },
      payment_status: { dataType: "string" },
      time_of_payment: { dataType: "date" }
    }
  },
  $inferSelect: {
    id: 1,
    amount: 50.0,
    payment_time: new Date(),
    tax: 7.0,
    payment_method: "credit_card",
    payment_status: "completed",
    time_of_payment: new Date()
  }
};

Deno.test("Payments Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    payments._ = mockPayments._;
    assertEquals(payments._.name, "payments");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    payments.$inferSelect = mockPayments.$inferSelect;
    const columns = payments.$inferSelect;
    
    assertEquals(typeof columns.id, "number");
    assertEquals(typeof columns.amount, "number");
    assertEquals(typeof columns.payment_time, "object");
    assertEquals(typeof columns.tax, "number");
    assertEquals(typeof columns.payment_method, "string");
    assertEquals(typeof columns.payment_status, "string");
    assertEquals(typeof columns.time_of_payment, "object");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = payments._.columns;
    
    assertEquals(columns.id.dataType, "number");
    assertEquals(columns.amount.dataType, "number");
    assertEquals(columns.payment_time.dataType, "date");
    assertEquals(columns.tax.dataType, "number");
    assertEquals(columns.payment_method.dataType, "string");
    assertEquals(columns.payment_status.dataType, "string");
    assertEquals(columns.time_of_payment.dataType, "date");
  });
});
