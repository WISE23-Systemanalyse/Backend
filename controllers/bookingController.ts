import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { bookingRepositoryObj } from "../db/repositories/bookings.ts";
import { Booking } from "../db/models/bookings.ts";

export class BookingController {
  async getAll(ctx: RouterContext<"/bookings">): Promise<void> {
    const bookings = await bookingRepositoryObj.findAll();
    ctx.response.body = bookings;
  }

  async getOne(ctx: RouterContext<"/bookings/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const booking = await bookingRepositoryObj.find(Number(id));
    if (booking) {
      ctx.response.body = booking;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Booking not found" };
    }
  }

  async create(ctx: RouterContext<"/bookings">): Promise<void> {
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

  async update(ctx: RouterContext<"/bookings/:id">): Promise<void> {
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
        ctx.response.body = { message: "BookingId, showId and userId are required" };
        return;
        }
    } catch (e) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Invalid JSON" };
        return;
        }
    const booking = await bookingRepositoryObj.update(Number(id), contextBooking);
    ctx.response.status = 200;
    ctx.response.body = booking;
    }

    async delete(ctx: RouterContext<"/bookings/:id">): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const booking = await bookingRepositoryObj.find(Number(id));
        if (booking) {
            await bookingRepositoryObj.delete(Number(id));
            ctx.response.status = 204;
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Booking not found" };
        }
    }

    async getBookingsByShowId(ctx: RouterContext<"/bookings/show/:id">): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const bookings = await bookingRepositoryObj.getBookingsByShowId(Number(id));
        ctx.response.body = bookings;
    }

    async getBookingsByUserId(ctx: RouterContext<"/bookings/user/:id">): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const bookings = await bookingRepositoryObj.getBookingsByUserId(id);
        ctx.response.body = bookings;
    }

    async getAllBookingDetails(ctx: RouterContext<"/bookings/details">): Promise<void> {
        const bookingDetails = await bookingRepositoryObj.getAllBookingDetails;
        ctx.response.body = bookingDetails;
    }
    async getByPaymentId(ctx: RouterContext<"/bookings/payment/:paymentId">): Promise<void> {
      const { paymentId } = ctx.params;
      
      if (!paymentId) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Payment ID is required" };
        return;
      }

      try {
        const bookings = await bookingRepositoryObj.getBookingsByPaymentId(Number(paymentId));
        
        if (bookings && bookings.length > 0) {
          ctx.response.body = bookings;
        } else {
          ctx.response.status = 404;
          ctx.response.body = { message: "No bookings found for this payment" };
        }
      } catch (error: unknown) {
        console.error('Error fetching bookings:', error);
        ctx.response.status = 500;
        ctx.response.body = { message: error instanceof Error ? error.message : 'Unknown error' };
      }
    }
}

export const bookingController = new BookingController();
