import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { hallRepositoryObj } from "../db/repositories/halls.ts";
import { seatRepositoryObj } from "../db/repositories/seats.ts";
import { Hall } from "../db/models/halls.ts";

export class HallController{
  async getAll(ctx: RouterContext<"/halls">): Promise<void> {
    const halls = await hallRepositoryObj.findAll();
    ctx.response.body = halls;
  }

  async getOne(ctx: RouterContext<"/halls/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const hall = await hallRepositoryObj.find(Number(id));
    if (hall) {
      ctx.response.body = hall;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Hall not found" };
    }
  }

  async getSeats(ctx: RouterContext<"/halls/:id/seats">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "HallId parameter is required" };
      return;
    }
    const Hall = await hallRepositoryObj.find(Number(id));
    if (!Hall) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Hall not found" };
      return;
    }
    const seats = await seatRepositoryObj.findByHallId(Number(id));
    ctx.response.body = seats;
  }
  async create(ctx: RouterContext<"/halls">): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const contextHall: Hall = await value.json();
    try {
      if (!contextHall.name || !contextHall.seating_capacity) {
        throw new Error("Invalid JSON");
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }

    const hall = await hallRepositoryObj.create(contextHall);
    ctx.response.status = 201;
    ctx.response.body = hall;
  }

  async update(ctx: RouterContext<"/halls/:id">): Promise<void> {
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
    const contextHall: Hall = await value.json();
    try {
      if (!contextHall.name || !contextHall.seating_capacity) {
        throw new Error("Invalid JSON");
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const hall = await hallRepositoryObj.update(Number(id), contextHall);
    if (hall) {
      ctx.response.body = hall;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Hall not found" };
    }
  }

  async delete(ctx: RouterContext<"/halls/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const hall = await hallRepositoryObj.find(Number(id));
    if (hall) {
      await hallRepositoryObj.delete(Number(id));
      ctx.response.status = 204;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Hall not found" };
    }
  }
}

export const hallController = new HallController();
