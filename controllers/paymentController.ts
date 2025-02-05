import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { paymentRepositoryObj } from "../db/repositories/index.ts";
import { Payment } from "../db/models/payments.ts";
import { payPalServiceObj } from "../services/payPalService.ts";
import { showRepositoryObj } from "../db/repositories/shows.ts";
import { seatRepositoryObj } from "../db/repositories/seats.ts";
import { categoryRepositoryObj } from "../db/repositories/categories.ts";
import { bookingRepositoryObj } from "../db/repositories/bookings.ts";


export class PaymentController implements Controller<Payment> {

  async getAll(ctx: Context): Promise<void> {
    const payments = await paymentRepositoryObj.findAll();
    ctx.response.body = payments;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const payment = await paymentRepositoryObj.find(id);
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
      if (!contextPayment.amount || !contextPayment.tax) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Missing required fields" };
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }

    const payment = await paymentRepositoryObj.create(contextPayment);
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

    const payment = await paymentRepositoryObj.update(id, contextPayment);
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
        const payment = await paymentRepositoryObj.find(id);
        if (payment) {
            await paymentRepositoryObj.delete(id);
            ctx.response.status = 204;
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Payment not found" };
        }
    }

    async createPayPalOrder(ctx: Context): Promise<void> {
      const { seats, showId } = await ctx.request.body.json();
      
      // Calculate total with tax
      const show = await showRepositoryObj.find(showId);
      const seatDetails = await Promise.all(
        seats.map(async (seatId: number) => {
          const seat = await seatRepositoryObj.find(seatId);
          const category = await categoryRepositoryObj.find(seat?.category_id!);
          return { seat, category };
        })
      );
  
      const items = seatDetails.map(({ seat, category }) => ({
        name: `Seat R${seat.row_number} P${seat.seat_number}`,
        quantity: 1,
        price: show?.base_price + category.surcharge
      }));
  
      try {
        const order = await payPalServiceObj.createOrder(items);
        ctx.response.status = 200;
        ctx.response.body = order;
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = { message: error.message };
      }
    }

  async capturePayPalOrder(ctx: Context): Promise<void> {
    const { orderId } = ctx.params;
    if (!orderId) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Order ID is required" };
      return;
    }

    try {
      const captureData = await payPalServiceObj.captureOrder(orderId);
      ctx.response.status = 200;
      ctx.response.body = captureData;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: e.message };
    }
  }

  async finalizeBooking(ctx: Context): Promise<void> {
    const { orderId, seats, showId, userId } = await ctx.request.body.json();
    
      // 1. Capture PayPal payment
      const captureData = await payPalServiceObj.captureOrder(orderId);
      
      // 2. Create payment record
      const payment = await paymentRepositoryObj.create(
        {
          amount: Number(captureData.purchase_units[0].amount.value),
          tax: Number(captureData.purchase_units[0].amount.breakdown.tax_total.value),
          payment_details: JSON.stringify(captureData),
          payment_method: 'PayPal',
          payment_status: 'completed',
          payment_time: new Date(),
          time_of_payment: new Date()

        }
      );

      const bookings = await Promise.all(
        seats.map((seatId: number) => {
          return bookingRepositoryObj.create({
            seat_id: seatId,
            show_id: showId,
            user_id: userId,
            payment_id: payment.id,
            token: Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15),
            booking_time: new Date()
          });
        })
      );
  
      ctx.response.status = 201;
      ctx.response.body = { 
        payment_id: payment.id,
        bookings 
      };
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }
}

export const paymentController = new PaymentController();