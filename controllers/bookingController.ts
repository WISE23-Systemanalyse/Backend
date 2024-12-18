import { Context } from "https://deno.land/x/oak/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { bookingRepository } from "../db/repositories/bookings.ts";
import { Booking } from "../db/models/bookings.ts";


export class BookingController implements Controller<Booking> {
  async getAll(ctx: Context): Promise<void> {
    const bookings = await bookingRepository.findAll();
    ctx.response.body = bookings;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const booking = await bookingRepository.find(id);
    if (booking) {
      ctx.response.body = booking;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Booking not found" };
    }
  }

  async create(ctx: Context): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }
    
    const contextBooking:Booking = await value.json();
    try {
      if(!contextBooking.seat_id || !contextBooking.show_id || !contextBooking.user_id || !contextBooking.payment_id) {
        ctx.response.status = 400;
        ctx.response.body = { message: "SeatId, ShowId, UserId and PaymentId are required" };
        return;
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
  
    const booking = await bookingRepository.create( contextBooking );
    ctx.response.status = 201;
    ctx.response.body = booking;
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
        ctx.response.body = { message: "BookingId, showId and userId are required" };
        return;
        }
    } catch (e) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Invalid JSON" };
        return;
        }
    const booking = await bookingRepository.update(id, contextBooking);
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
        const booking = await bookingRepository.find(id);
        if (booking) {
            await bookingRepository.delete(id);
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
        const bookings = await bookingRepository.getBookingsByShowId(id);
        ctx.response.body = bookings;
    }

    async getBookingsByUserId(ctx: Context): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        console.log(id);
        const bookings = await bookingRepository.getBookingsByUserId(id);
        ctx.response.body = bookings;
    }


}

export const bookingController = new BookingController();