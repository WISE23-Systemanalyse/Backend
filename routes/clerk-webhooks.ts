import { Router } from "https://deno.land/x/oak/mod.ts";
import { Webhook } from "https://esm.sh/svix@0.73.0";
import { WebhookEvent } from "https://esm.sh/@clerk/backend";
import { db } from "../db/db.ts";
import { user } from "../db/schema.ts";
import { eq } from "drizzle-orm/expressions";

const WebhookRouter = new Router();

WebhookRouter.post("/clerk-webhooks", async (ctx) => {
  const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  const headers = ctx.request.headers;
  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Error occurred -- no svix headers" };
    return;
  }

  const body = await ctx.request.body({ type: "text" }).value;

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    ctx.response.status = 400;
    ctx.response.body = { error: "Error occurred" };
    return;
  }

  const eventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const primaryEmail = email_addresses.find(
      (email) => email.id === evt.data.primary_email_address_id,
    )?.email_address;

    if (!primaryEmail) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No primary email found" };
      return;
    }

    await db.insert(user).values({
      id: id,
      email: primaryEmail,
      firstName: first_name || null,
      lastName: last_name || null,
    }).onConflictDoUpdate({
      target: user.id,
      set: {
        email: primaryEmail,
        firstName: first_name || null,
        lastName: last_name || null,
      },
    });
  } else if (eventType === "user.deleted") {
    await db.delete(user).where(eq(user.id, evt.data.id));
  }

  ctx.response.body = { message: "Webhook received" };
});

export { WebhookRouter };