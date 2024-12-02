import { Context } from "https://deno.land/x/oak/mod.ts";
import { userService } from "../services/userService.ts";

const userController = {
  // Status Route: Gibt den Status der App zurück
  getUser: async (ctx: Context) => {
    const { id }= ctx.params;
    if (id && !isNaN(Number(id)) ) {
      const parsedId = parseInt(id, 10);
      const user = await userService.getUserById(parsedId);
      if (user) {
        ctx.response.status = 200;
        ctx.response.body = user;
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "User not found" };
      }
    } else {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid user ID" };
    }
  }
};

export { userController };
