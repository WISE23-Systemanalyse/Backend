import { Context } from "https://deno.land/x/oak/mod.ts";
import { emailService } from "../services/emailService.ts";

export class NewsletterController {
    async subscribe(ctx: Context): Promise<void> {
        console.log("here");
        const value = await ctx.request.body;
        if (!value) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Request body is required" };
            return;
        }

        const { email } = await value.json();
        if (!email) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Email is required" };
            return;
        }

        try {
            await emailService.sendNewsletterConfirmation(email);
            ctx.response.status = 200;
            ctx.response.body = { message: "Confirmation email sent" };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = { message: "Failed to send confirmation email" };
        }
    }
}

export const newsletterController = new NewsletterController(); 