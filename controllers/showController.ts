import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { showRepository } from "../db/repositories/shows.ts";
import { Show } from "../db/models/shows.ts";
import { bookingRepository } from "../db/repositories/bookings.ts";

export class ShowController implements Controller<Show> {
    async getAll(ctx: Context): Promise<void> {
        console.log("Get all shows called");
        const shows = await showRepository.findAll();
        ctx.response.body = shows;
    }

    async getAllWithDetails(ctx: Context): Promise<void> {
        const shows = await showRepository.findAllWithDetails();
        ctx.response.body = shows;
    }

    async getOne(ctx: Context): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const show = await showRepository.find(id);
        if (show) {
            ctx.response.body = show;
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Show not found" };
        }
    }

    async create(ctx: Context): Promise<void> {
        const value = await ctx.request.body;
        const { movie_id, hall_id, start_time }  = await value.json();
    
        if (!movie_id || !hall_id || !start_time) {
          ctx.response.status = 400;
          ctx.response.body = { message: "Missing required fields" };
          return;
        }
    
        // Convert start_time to a Date object
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
          const show = await showRepository.create(newShow);
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
        const show = await showRepository.find(contextShow.id);
        if (show) {
            const updatedShow = await showRepository.update(contextShow.id, contextShow);
            ctx.response.status = 200;
            ctx.response.body = updatedShow;
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Show not found" };
        }
    }

    async delete(ctx: Context): Promise<void> {
        const { id } = ctx.params;
        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Id parameter is required" };
            return;
        }
        const show = await showRepository.find(id);
        if (show) {
            await showRepository.delete(id);
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
        const show = await showRepository.find(id);
        if (show) {
            const bookings = await bookingRepository.getBookingsByShowId(id);
            ctx.response.body = bookings;
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Show not found" };
        }
    }
}

export const showController = new ShowController();