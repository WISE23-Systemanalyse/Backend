import { Context } from "https://deno.land/x/oak/mod.ts";

const statusController = {
  // Status Route: Gibt den Status der App zurück
  getStatus: async (ctx: Context) => {
    const statusData = {
      message: "App is running smoothly",
      status: "OK"
    };
    ctx.response.status = 200; // Statuscode 200 für Erfolg
    ctx.response.body = statusData; // Statusinformationen zurückgeben
  }
};

export { statusController };
