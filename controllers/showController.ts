import { Context } from "https://deno.land/x/oak/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { showRepositoryObj } from "../db/repositories/shows.ts";
import { Show } from "../db/models/shows.ts";
import { bookingRepositoryObj } from "../db/repositories/bookings.ts";
import { seatRepositoryObj } from "../db/repositories/seats.ts";
import { reservationServiceObj } from "../services/reservationService.ts";

export class ShowController implements Controller<Show> {
  async getAll(ctx: Context): Promise<void> {
    console.log("Get all shows called");
    const shows = await showRepositoryObj.findAll();
    ctx.response.body = shows;
  }

  async getAllWithDetails(ctx: Context): Promise<void> {
    const shows = await showRepositoryObj.findAllWithDetails();
    ctx.response.body = shows;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    console.log("Controller getOne called");
    const show = await showRepositoryObj.find(id);
    if (show) {
      ctx.response.body = show;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Show not found" };
    }
  }

  async getOneWithDetails(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const show = await showRepositoryObj.findOneWithDetails(id);
    if (show) {
      ctx.response.body = show;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Show not found" };
    }
  }

  async create(ctx: Context): Promise<void> {
    const value = await ctx.request.body;
    const { movie_id, hall_id, start_time } = await value.json();

    if (!movie_id || !hall_id || !start_time) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Missing required fields" };
      return;
    }

    const startTime = new Date(start_time);
    if (isNaN(startTime.getTime())) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid start_time format" };
      return;
    }

    const newShow: Partial<Show> = {
      movie_id,
      hall_id,
      start_time: startTime,
    };

    try {
      const show = await showRepositoryObj.create(newShow);
      ctx.response.status = 201;
      ctx.response.body = show;
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { message: error.message };
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
    const contextShow: Show = await value.json();
    const show = await showRepositoryObj.find(contextShow.id);
    if (show) {
      const updatedShow = await showRepositoryObj.update(
        contextShow.id,
        contextShow,
      );
      ctx.response.status = 200;
      ctx.response.body = updatedShow;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Show not found" };
    }
  }

  async delete(ctx: Context): Promise<void> {
    console.log("Delete called");
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const show = await showRepositoryObj.find(id);
    if (show) {
      await showRepositoryObj.delete(id);
      ctx.response.status = 204;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Show not found" };
    }
  }

  async getBookingsByShowId(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const show = await showRepositoryObj.find(id);
    if (show) {
      const bookings = await bookingRepositoryObj.getBookingsByShowId(id);
      ctx.response.body = bookings;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Show not found" };
    }
  }

  async getSeatsWithStatus(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Show ID is required" };
      return;
    }

    const show = await showRepositoryObj.find(id);
    if (!show) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Show not found" };
      return;
    }

    const allSeats = await seatRepositoryObj.findByHallId(show.hall_id);
    const bookedSeats = await bookingRepositoryObj.getBookingsByShowId(id);
    const reservedSeats = await reservationServiceObj.getReservationsByShowId(
      id,
    );

    const seatsWithStatus = allSeats.map((seat) => ({
      ...seat,
      seat_status: bookedSeats.some((booking) => booking.seat_id === seat.id)
        ? "BOOKED"
        : reservedSeats.some((reservation) => reservation.seat_id === seat.id && reservation.expire_at > new Date())
        ? "RESERVED"
        : "AVAILABLE",
    }));

    ctx.response.body = seatsWithStatus;
  }
}

export const showControllerObj = new ShowController();
