import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { emailServiceObj } from "../services/emailService.ts";

export class ContactController {
    async submitForm(ctx: Context): Promise<void> {
        try {
            // Request-Body überprüfen
            const value = await ctx.request.body;
            if (!value) {
                ctx.response.status = 400;
                ctx.response.body = { message: "Request body ist erforderlich" };
                return;
            }

            // Formular-Daten parsen mit Fehlerbehandlung
            let formData;
            try {
                formData = await value.json();
            } catch (error) {
                ctx.response.status = 400;
                ctx.response.body = { message: "Ungültiges JSON Format" };
                return;
            }

            const { name, email, subject, message } = formData;


            await emailServiceObj.sendContactFormMail({ name, email, subject, message });

            // Validierung aller Felder
            if (!name?.trim()) {
                ctx.response.status = 400;
                ctx.response.body = { message: "Name ist erforderlich" };
                return;
            }

            if (!email || !ContactController.isValidEmail(email)) {
                ctx.response.status = 400;
                ctx.response.body = { message: "Ungültige E-Mail-Adresse" };
                return;
            }

            if (!subject?.trim()) {
                ctx.response.status = 400;
                ctx.response.body = { message: "Betreff ist erforderlich" };
                return;
            }

            if (!message?.trim()) {
                ctx.response.status = 400;
                ctx.response.body = { message: "Nachricht ist erforderlich" };
                return;
            }

            // Kontaktformular-E-Mail senden
            await emailService.sendContactFormMail({ 
                name: name.trim(), 
                email: email.trim(), 
                subject: subject.trim(), 
                message: message.trim() 
            });
            
            ctx.response.status = 200;
            ctx.response.body = { message: "Kontaktanfrage erfolgreich gesendet" };

        } catch (error) {
            console.error("Contact Form Submission Error Details:", {
                error: error,
                stack: error instanceof Error ? error.stack : undefined,
                message: error instanceof Error ? error.message : "Unbekannter Fehler",
                name: error instanceof Error ? error.name : "UnknownError"
            });
            ctx.response.status = 500;
            ctx.response.body = { 
                message: "Fehler beim Senden der Kontaktanfrage",
                error: error instanceof Error ? error.message : "Unbekannter Fehler"
            };
        }
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

export const contactController = new ContactController(); 