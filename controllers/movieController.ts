import { Context } from "https://deno.land/x/oak/mod.ts";
import { movieService } from "../services/movieService.ts";

const movieController = {
  // Status Route: Gibt den Status der App zurück
  getMovie: async (ctx: Context) => {
    const { id }= ctx.params;
    if (id && !isNaN(Number(id)) ) {
      const parsedId = parseInt(id, 10);
      const moivie = await movieService.getMovie(parsedId);
      if (moivie) {
        ctx.response.status = 200;
        ctx.response.body = moivie;
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Moivie not found" };
      }
    } else {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid moivie ID" };
    }
  }
};

export { movieController };
