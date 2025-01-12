import { Context } from "https://deno.land/x/oak/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { seatRepository } from "../db/repositories/index.ts";
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
      ctx.response.body = { message: "Hall ID parameter is required" };
      return;
    }

    try {
      const seats = await seatRepository.findByHallId(hallId);
      ctx.response.body = seats;
    } catch (e) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Error fetching seats for hall" };
    }
  }
}
export const seatController = new SeatController();