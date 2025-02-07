import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";

import { seatRepositoryObj } from "../db/repositories/seats.ts";
import { Seat } from "../db/models/seats.ts";
import { reservationServiceObj } from "../services/reservationService.ts";

export class SeatController {
  async getAll(ctx: RouterContext<string>): Promise<void> {
    const seats = await seatRepositoryObj.findAll();
    ctx.response.body = seats;
  }

  async getOne(ctx: RouterContext<"/seats/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const seat = await seatRepositoryObj.find(Number(id));
    if (seat) {
      ctx.response.body = seat;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Seat not found" };
    }
  }

  async create(ctx: RouterContext<string>): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }
    const contextSeat: Seat = await value.json();
    try {
      const { hall_id, row_number, seat_number, category_id } = contextSeat;
      if (!hall_id || !row_number || !seat_number || !category_id) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Row, number, hallId and categoryId are required" };
        return;
      }
    } catch (e:any) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const seat = await seatRepositoryObj.create(contextSeat);
    ctx.response.status = 201;
    ctx.response.body = seat;
  }

  async update(ctx: RouterContext<string>): Promise<void> {
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
    const contextSeat: Seat = await value.json();
    try {
      const { hall_id, row_number, seat_number } = contextSeat;
      if (!hall_id || !row_number || !seat_number) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Row, number and hallId are required" };
        return;
      }
    } catch (e:any) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const seat = await seatRepositoryObj.update(Number(id), contextSeat);
    ctx.response.status = 200;
    ctx.response.body = seat;
  }
  async delete(ctx: RouterContext<string>): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    await seatRepositoryObj.delete(Number(id));
    ctx.response.status = 204;
  }

  async bulkCreate(ctx: RouterContext<string>): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }
  
    const seats = await value.json();
    if (!Array.isArray(seats)) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body must be an array of seats" };
      return;
    }

    try {
      const createdSeats = await Promise.all(
        seats.map((seat) => seatRepositoryObj.create(seat)),
      );
      ctx.response.status = 201;
      ctx.response.body = createdSeats;
    } catch (error:any) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }

  async bulkUpdate(ctx: RouterContext<string>): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const seats = await value.json();
    if (!Array.isArray(seats)) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body must be an array of seats" };
      return;
    }

    try {
      const updatedSeats = await Promise.all(
        seats.map((seat) => seatRepositoryObj.update(seat.id, seat)),
      );
      ctx.response.body = updatedSeats;
    } catch (error:any) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }

  async bulkDelete(ctx: RouterContext<string>): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const seatIds = await value.json();
    if (!Array.isArray(seatIds)) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Request body must be an array of seat IDs",
      };
      return;
    }

    try {
      await Promise.all(seatIds.map((id) => seatRepositoryObj.delete(id)));
      ctx.response.status = 204;
    } catch (error:any  ) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }

  async syncHallSeats(ctx: RouterContext<string>): Promise<void> {
    const { hallId } = ctx.params;
    if (!hallId) {
      ctx.response.status = 400;
      ctx.response.body = { message: "HallId parameter is required" };
      return;
    }

    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const newSeats = await value.json();
    if (!Array.isArray(newSeats)) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body must be an array of seats" };
      return;
    }

    try {
      // Lösche alle existierenden Sitze des Saals
      await seatRepositoryObj.deleteByHallId(Number(hallId));

      // Erstelle die neuen Sitze
      const createdSeats = await Promise.all(
        newSeats.map((seat) => ({
          ...seat,
          hall_id: Number(hallId),
        })).map((seat) => seatRepositoryObj.create(seat)),
      );

      ctx.response.status = 201;
      ctx.response.body = createdSeats;
    } catch (error:any) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }
  async reserve(ctx: RouterContext<string>): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    try {
      const RequestObj = await ctx.request.body.json();
      const response = await reservationServiceObj.create(RequestObj);
      ctx.response.status = 201;
      ctx.response.body = { message: response };
    } catch (error:any) {
      const err = error as Error;
      ctx.response.status = (error as { status?: number }).status || 500;
      ctx.response.body = { message: err.message || "Internal Server Error" };
    }
  }
}

export const seatControllerObj = new SeatController();