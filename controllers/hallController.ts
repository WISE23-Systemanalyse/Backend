import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { hallRepository } from "../db/repositories/halls.ts";
import { Hall } from "../db/models/halls.ts";

export class HallController implements Controller<Hall> {
  async getAll(ctx: Context): Promise<void> {
    const halls = await hallRepository.findAll();
    ctx.response.body = halls;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const hall = await hallRepository.find(id);
    if (hall) {
      ctx.response.body = hall;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Hall not found" };
    }
  }

  async create(ctx: Context): Promise<void> {
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

    const hall = await hallRepository.create(contextHall);
    ctx.response.status = 201;
    ctx.response.body = hall;
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
    const hall = await hallRepository.update(id, contextHall);
    if (hall) {
      ctx.response.body = hall;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Hall not found" };
    }
  }

  async delete(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const hall = await hallRepository.find(id);
    if (hall) {
      await hallRepository.delete(id);
      ctx.response.status = 204;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Hall not found" };
    }
  }
}

export const hallController = new HallController();
