import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";

const SECRET_KEY = "your-secret-key-at-least-32-chars-long";

export async function authMiddleware(ctx: Context, next: () => Promise<void>) {
  const jwt = ctx.cookies.get("jwt");
  
  if (!jwt) {
    ctx.response.status = 401;
    ctx.response.body = { message: "not authorized" };
    return;
  }

  const token = jwt.split(" ")[1];

  
  try {
    const payload = await verify(token, SECRET_KEY, "HS256");
    await next();
  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid token" };
  }
}
