import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { emailServiceObj } from "../services/emailService.ts";

export class ContactController {
    async submitForm(ctx: Context): Promise<void> {
        const value = await ctx.request.body;
        if (!value) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Request body is required" };
            return;
        }

        const formData = await value.json();
        const { name, email, subject, message } = formData;

        if (!name || !email || !subject || !message) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Alle Felder sind erforderlich" };
            return;
        }

        try {
            await emailServiceObj.sendContactFormMail({ name, email, subject, message });
            ctx.response.status = 200;
            ctx.response.body = { message: "Kontaktanfrage erfolgreich gesendet" };
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = { message: "Fehler beim Senden der Kontaktanfrage" };
        }
    }
}

export const contactController = new ContactController(); 