import { Context, RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { movieRepository, showRepository } from "../db/repositories/index.ts";
import { Movie } from "../db/models/movies.ts";
import { TMDBService } from "../services/tmdbService.ts";

export class MovieController implements Controller<Movie> {
  async getAll(ctx: Context): Promise<void> {
    const movies = await movieRepository.findAll();
    ctx.response.body = movies;
  }

  async getOne(ctx: RouterContext<"/movies/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const movie = await movieRepository.find(Number(id));
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
      const { title, duration } = contextMovie;
      if (!title) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Title is required" };
        return;
      }
      if (!duration || duration <= 0) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Duration must be a positive number" };
        return;
      }
    } catch (_e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const movie = await movieRepository.create(contextMovie);
    ctx.response.status = 201;
    ctx.response.body = movie;
  }

  async update(ctx: RouterContext<"/movies/:id">): Promise<void> {
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
      const { title, id, duration } = contextMovie;
      if (!title || !id) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Title and id are required" };
        return;
      }
      if (!duration || duration <= 0) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Duration must be a positive number" };
        return;
      }
    } catch (_e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const movie = await movieRepository.update(Number(id), contextMovie);
    ctx.response.body = movie;
  }
  async delete(ctx: RouterContext<"/movies/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    await movieRepository.delete(Number(id));
    ctx.response.status = 204;
  }

  async searchTMDB(ctx: Context): Promise<void> {
    try {
      const query = ctx.request.url.searchParams.get("query");
      if (!query) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Query parameter is required" };
        return;
      }

      const movies = await TMDBService.searchMovies(query);
      ctx.response.body = movies;
    } catch (error: unknown) {
      ctx.response.status = 500;
      ctx.response.body = { message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getPopularTMDB(ctx: Context): Promise<void> {
    try {
      const movies = await TMDBService.getPopularMovies();
      ctx.response.body = movies;
    } catch (error: unknown) {
      ctx.response.status = 500;
      ctx.response.body = { message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getGenres(ctx: RouterContext<"/movies/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const movie = await movieRepository.find(Number(id));
    if (movie) {
      ctx.response.body = movie.genres || [];
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Movie not found" };
    }
  }

  async updateGenres(ctx: RouterContext<"/movies/:id">): Promise<void> {
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

    const { genres } = await value.json();
    if (!genres || !Array.isArray(genres)) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Genres must be an array" };
      return;
    }

    const movie = await movieRepository.find(Number(id));
    if (!movie) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Movie not found" };
      return;
    }

    const updatedMovie = await movieRepository.update(Number(id), { ...movie, genres });
    ctx.response.body = updatedMovie;
  }
  async getShowsByMovieId(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const movie = await movieRepository.find(Number(id));
    if (movie) {
      const shows = await showRepository.findByMovieId(Number(id));
      ctx.response.body = shows;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Movie not found" };
    }
  }
}

export const movieController = new MovieController();