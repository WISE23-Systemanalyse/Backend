import { db } from "../db.ts";
import { Repository, Create } from "../../interfaces/repository.ts";
import { payments, Payment } from "../models/payments.ts";
import { eq } from "drizzle-orm";

export class PaymentRepository implements Repository<Payment> {
  async findAll(): Promise<Payment[]> {
    const allPayments = await db.select().from(payments);
    return allPayments;
  }
  async find(id: Payment["id"]): Promise<Payment | null> {
    const result = await db.query.payments.findFirst({
      where: eq(payments.id, id),
    });
    return result ?? null;
  }
  async delete(id: Payment["id"]): Promise<void> {
    await db.delete(payments).where(eq(payments.id, id));
  }
  async create(value: Create<Payment>): Promise<Payment> {
    const [payment] = await db.insert(payments).values(value).returning();
    return payment;
  }
  async update(id: Payment["id"], value: Create<Payment>): Promise<Payment> {
    const [updatedPayment] = await db.update(payments).set(value).where(
      eq(payments.id, id),
    ).returning();
    return updatedPayment;
  }
}

export const paymentRepository = new PaymentRepository();