import { Context } from "https://deno.land/x/oak/mod.ts";
import { emailServiceObj } from "../services/emailService.ts";

export class NewsletterController {
  async subscribe(ctx: Context): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    // E-Mail aus dem Body extrahieren mit zusätzlicher Fehlerbehandlung
    let email: string;
    try {
      const body = await value.json();
      email = body.email;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Ungültiges JSON Format" };
      return;
    }

    try {
      await emailServiceObj.sendNewsletterConfirmation(email);
      // E-Mail-Validierung
      if (!email || !NewsletterController.isValidEmail(email)) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Ungültige E-Mail-Adresse" };
        return;
      }
      // Newsletter-Bestätigung senden
      await emailServiceObj.sendNewsletterConfirmation(email);
      ctx.response.status = 200;
      ctx.response.body = { message: "Bestätigungs-E-Mail wurde gesendet" };
    } catch (error) {
      console.error("Newsletter Subscription Error Details:", {
        error: error,
        stack: error instanceof Error ? error.stack : undefined,
        message: error instanceof Error ? error.message : "Unbekannter Fehler",
        name: error instanceof Error ? error.name : "UnknownError",
      });
      ctx.response.status = 500;
      ctx.response.body = {
        message: "Ein Fehler ist aufgetreten",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      };
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const newsletterController = new NewsletterController();
