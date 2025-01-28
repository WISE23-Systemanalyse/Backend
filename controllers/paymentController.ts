import { Context } from "https://deno.land/x/oak/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { paymentRepository } from "../db/repositories/index.ts";
import { Payment } from "../db/models/payments.ts";


export class PaymentController implements Controller<Payment> {
  async getAll(ctx: Context): Promise<void> {
    const payments = await paymentRepository.findAll();
    ctx.response.body = payments;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const payment = await paymentRepository.find(id);
    if (payment) {
      ctx.response.body = payment;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Payment not found" };
    }
  }

  async create(ctx: Context): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const contextPayment: Payment = await value.json();
    try {
      if (!contextPayment.amount || !contextPayment.tax || !contextPayment.payment_method || !contextPayment.payment_status || !contextPayment.payment_details) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Missing required fields" };
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }

    const payment = await paymentRepository.create(contextPayment);
    ctx.response.status = 201;
    ctx.response.body = payment;
  }

  async update(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const contextPayment: Payment = await value.json();
    try {
      if (!contextPayment.amount || !contextPayment.tax) {
        throw new Error("Invalid JSON");
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }

    const payment = await paymentRepository.update(id, contextPayment);
    if (payment) {
      ctx.response.body = payment;
    } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Payment not found" };
    }
    }
    async delete(ctx: Context): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const payment = await paymentRepository.find(id);
        if (payment) {
            await paymentRepository.delete(id);
            ctx.response.status = 204;
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Payment not found" };
        }
    }
}

export const paymentController = new PaymentController();