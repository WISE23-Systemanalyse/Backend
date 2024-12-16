import { Context } from "https://deno.land/x/oak/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { movieRepository } from "../db/repositories/movies.ts";
import { Movie } from "../db/models/movies.ts";

export class MovieController implements Controller<Movie> {
  async getAll(ctx: Context): Promise<void> {
    const movies = await movieRepository.findAll();
    ctx.response.body = movies;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const movie = await movieRepository.find(id);
    if (movie) {
      ctx.response.body = movie;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Movie not found" };
    }
  }

  async create(ctx: Context): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }
    const contextMovie:Movie = await value.json();
    try {
      const { title } = contextMovie;
      if (!title ) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Title is required" };
        return;
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const movie = await movieRepository.create( contextMovie );
    ctx.response.status = 201;
    ctx.response.body = movie;
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
    const contextMovie:Movie = await value.json();
    try {
      const { title, id } = contextMovie;
      if (!title || !id) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Title and id are required" };
        return;
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const movie = await movieRepository.update(id, contextMovie);
    ctx.response.body = movie;
  }
  async delete(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    await movieRepository.delete(id);
    ctx.response.status = 204;
  }
}

export const movieController = new MovieController();