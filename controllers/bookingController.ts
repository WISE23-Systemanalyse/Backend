import { Context } from "https://deno.land/x/oak/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { bookingRepositoryObj } from "../db/repositories/bookings.ts";
import { Booking } from "../db/models/bookings.ts";


export class BookingController implements Controller<Booking> {
  async getAll(ctx: Context): Promise<void> {
    const bookings = await bookingRepositoryObj.findAll();
    ctx.response.body = bookings;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const booking = await bookingRepositoryObj.find(id);
    if (booking) {
      ctx.response.body = booking;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Booking not found" };
    }
  }

  async getByToken(ctx: Context): Promise<void> {
    const { token } = ctx.params;
    if (!token) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Token parameter is required" };
      return;
    }
    const bookings = await bookingRepositoryObj.getBookingsByToken(token);
    ctx.response.body = bookings;
  }

  async create(ctx: Context): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    try {
      const data = await value.json();
      const booking = await bookingRepositoryObj.create(data);

      ctx.response.status = 201;
      ctx.response.body = booking;
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
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
    const contextBooking:Booking = await value.json();
    try {
      const { id, show_id, user_id } = contextBooking;
      if (!id || !show_id || !user_id) {
        ctx.response.status = 400;
        ctx.response.body = { message: "BookingId, showId, userId and token are required" };
        return;
        }
    } catch (e) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Invalid JSON" };
        return;
        }
    const booking = await bookingRepositoryObj.update(id, contextBooking);
    ctx.response.status = 200;
    ctx.response.body = booking;
    }

    async delete(ctx: Context): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const booking = await bookingRepositoryObj.find(id);
        if (booking) {
            await bookingRepositoryObj.delete(id);
            ctx.response.status = 204;
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Booking not found" };
        }
    }

    async getBookingsByShowId(ctx: Context): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const bookings = await bookingRepositoryObj.getBookingsByShowId(id);
        ctx.response.body = bookings;
    }

    async getBookingsByUserId(ctx: Context): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const bookings = await bookingRepositoryObj.getBookingsByUserId(id);
        ctx.response.body = bookings;
    }

    async getByPaymentId(ctx: Context): Promise<void> {
      const { paymentId } = ctx.params;
      
      if (!paymentId) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Payment ID is required" };
        return;
      }

      try {
        const bookings = await bookingRepositoryObj.getBookingsByPaymentId(paymentId);
        
        if (bookings && bookings.length > 0) {
          ctx.response.body = bookings;
        } else {
          ctx.response.status = 404;
          ctx.response.body = { message: "No bookings found for this payment" };
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        ctx.response.status = 500;
        ctx.response.body = { message: error.message };
      }
    }
}

export const bookingController = new BookingController();