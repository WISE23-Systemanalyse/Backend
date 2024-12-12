import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { verifyJwt } from "../utils/jwtUtils.ts";
import { v4 } from "https://deno.land/std@0.203.0/uuid/mod.ts";

export async function userMiddleware(ctx: Context, next: Function) {
const authHeader = ctx.request.headers.get("Authorization");
let userId = null;

if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = await verifyJwt(token);
    if (payload) {
    userId = payload.sub;
    }
}

if (!userId) {
    let guestId = ctx.cookies.get("guestId");
    if (!guestId) {
    guestId = v4.generate();
    ctx.cookies.set("guestId", guestId);
    }
    userId = guestId;
}

ctx.state.user = userId;
await next();
}
