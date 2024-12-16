import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";

const statusController = {
  // Status Route: Gibt den Status der App zurück
  reserve: async (ctx: Context) => {
    const statusData = {
      message: "App is running smoothly",
      status: "OK"
    };
    ctx.response.status = 200; // Statuscode 200 für Erfolg
    ctx.response.body = statusData; // Statusinformationen zurückgeben
  }

  async reserve(ctx: Context): Promise<void> {
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
    const movie = await movieRepository.create( contextMovie );
    ctx.response.status = 201;
    ctx.response.body = movie;
  }
};

export { statusController };
