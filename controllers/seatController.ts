import { Context, RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { seatRepository } from "../db/repositories/seats.ts";
import { Seat } from "../db/models/seats.ts";
export class SeatController implements Controller<Seat> {
  async getAll(ctx: Context): Promise<void> {
    const seats = await seatRepository.findAll();
    ctx.response.body = seats;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const seat = await seatRepository.find(id);
    if (seat) {
      ctx.response.body = seat;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Seat not found" };
    }
  }

  async create(ctx: Context): Promise<void> {
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
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const seat = await seatRepository.create(contextSeat);
    ctx.response.status = 201;
    ctx.response.body = seat;
  }

  async update(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const value = await ctx.request.body();
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }
    const contextSeat: Seat = await value.value;
    try {
      const { hall_id, row_number, seat_number } = contextSeat;
      if (!hall_id || !row_number || !seat_number) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Row, number and hallId are required" };
        return;
        
        }
    } catch (e) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Invalid JSON" };
        return;
        }
    const seat = await seatRepository.update(id, contextSeat);
    ctx.response.status = 200;
    ctx.response.body = seat;
    }
    async delete(ctx: Context): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        await seatRepository.delete(id);
        ctx.response.status = 204;
    }

  async getByHallId(ctx: Context): Promise<void> {
    const { hallId } = ctx.params;
    if (!hallId) {
      ctx.response.status = 400;
      ctx.response.body = { message: "HallId parameter is required" };
      return;
    }
    const seats = await seatRepository.findByHallId(hallId);
    ctx.response.body = seats;
  }

  async bulkCreate(ctx: RouterContext<"/seats/bulk">): Promise<void> {
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
        seats.map(seat => seatRepository.create(seat))
      );
      ctx.response.status = 201;
      ctx.response.body = createdSeats;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }

  async bulkUpdate(ctx: RouterContext<"/seats/bulk">): Promise<void> {
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
        seats.map(seat => seatRepository.update(seat.id, seat))
      );
      ctx.response.body = updatedSeats;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }

  async bulkDelete(ctx: RouterContext<"/seats/bulk">): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const seatIds = await value.json();
    if (!Array.isArray(seatIds)) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body must be an array of seat IDs" };
      return;
    }

    try {
      await Promise.all(seatIds.map(id => seatRepository.delete(id)));
      ctx.response.status = 204;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }

  async syncHallSeats(ctx: RouterContext<"/seats/halls/:hallId/sync">): Promise<void> {
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
      await seatRepository.deleteByHallId(hallId);

      // Erstelle die neuen Sitze
      const createdSeats = await Promise.all(
        newSeats.map(seat => ({
          ...seat,
          hall_id: Number(hallId)
        })).map(seat => seatRepository.create(seat))
      );

      ctx.response.status = 201;
      ctx.response.body = createdSeats;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }
}

export const seatController = new SeatController();