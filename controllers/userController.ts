import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { login, getUserById } from "../services/userService.ts";

export async function loginUser(ctx: Context) {
  const body = await ctx.request.body;
  const { email, password } = body;
  console.log(email, password);
  const token = await login(email, password);
  if (token) {
    ctx.response.body = { token };
  } else {
    ctx.response.status = 401;
    ctx.response.body = { error: "Ungültige Anmeldedaten" };
  }
}

export async function getProfile(ctx: Context) {
  const userId = ctx.state.user; // ID aus Middleware
  if (userId) {
    const user = await getUserById(userId);
    if (user) {
      ctx.response.body = { user };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { error: "Benutzer nicht gefunden" };
    }
  } else {
    ctx.response.body = { message: "Gastbenutzer" };
  }
}
