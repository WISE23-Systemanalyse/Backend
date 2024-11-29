import { Context } from "https://deno.land/x/oak/mod.ts";
import { statusService } from "../services/statusService.ts";

const statusController = {
  // Status Route: Gibt den Status der App zurück
  getStatus: async (ctx: Context) => {
    const statusData = await statusService.getStatus();
    ctx.response.status = 200; // Statuscode 200 für Erfolg
    ctx.response.body = statusData; // Statusinformationen zurückgeben
  }
};

export { statusController };
