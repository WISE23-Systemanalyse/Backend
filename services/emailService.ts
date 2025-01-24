import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

function getContactMailTemplate(data: ContactForm) {
    return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}.container{max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}h1{color:#333}p{color:#555}.info-box{background:#f8f9fa;border-left:4px solid #007bff;padding:15px;margin:20px 0}.label{font-weight:700;color:#333;margin-bottom:5px}.value{color:#555;margin-bottom:15px}.footer{margin-top:20px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#999}</style></head><body><div class="container"><h1>Ihre Kontaktanfrage ist eingegangen</h1><p>Vielen Dank für Ihre Nachricht. Wir haben Ihre Kontaktanfrage erfolgreich erhalten und werden uns schnellstmöglich bei Ihnen melden.</p><div class="info-box"><h2>Ihre Anfrage im Überblick:</h2><div class="label">Name:</div><div class="value">${data.name}</div><div class="label">E-Mail:</div><div class="value">${data.email}</div><div class="label">Betreff:</div><div class="value">${data.subject}</div><div class="label">Ihre Nachricht:</div><div class="value">${data.message}</div></div><p>Wir werden Ihre Anfrage sorgfältig prüfen und uns zeitnah bei Ihnen melden.</p><div class="footer"><p>Mit freundlichen Grüßen,<br>Ihr CinemaPlus Team</p></div></div></body></html>`;
}

function getNewsletterTemplate(email: string) {
    return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}.container{max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}h1{color:#333}p{color:#555}.footer{margin-top:20px;font-size:12px;color:#999}</style></head><body><div class="container"><h1>Willkommen zu unserem Newsletter!</h1><p>Vielen Dank, dass Sie sich für unseren Newsletter angemeldet haben. Wir freuen uns, Sie in unserer Community willkommen zu heißen!</p><p>In unserem Newsletter erwarten Sie:</p><ul><li>Exklusive Angebote und Rabatte</li><li>Neueste Nachrichten und Updates</li><li>Einblicke in kommende Produkte und Veranstaltungen</li></ul><p>Bleiben Sie dran und verpassen Sie keine Neuigkeiten!</p><p>Mit freundlichen Grüßen,<br>Ihr CinemaPlus Team</p></div></body></html>`;
}

function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

export class EmailService {
    private client: SMTPClient;
    private readonly username = "cinemaplus1995@gmail.com";
    private readonly password = "tebv xsag uwuh rjkx";

    constructor() {
        this.client = new SMTPClient({
            connection: {
                hostname: "smtp.gmail.com",
                port: 465,
                tls: true,
                auth: {
                    username: this.username,
                    password: this.password,
                }
            }
        });
    }

    async sendNewsletterConfirmation(email: string): Promise<void> {
        try {
            await this.client.send({
                from: this.username,
                to: email,
                subject: "Newsletter Anmeldung",
                html: getNewsletterTemplate(email),
            });
            console.log("Newsletter-E-Mail gesendet an:", email);
        } catch (error) {
            console.error("Fehler beim Senden der E-Mail:", error);
            throw error;
        }
    }

    async sendContactFormMail(data: ContactForm): Promise<void> {
        try {
            await this.client.send({
                from: this.username,
                to: data.email,
                subject: `Kontaktanfrage: ${data.subject}`,
                html: getContactMailTemplate(data),
            });
            console.log("Kontaktformular-E-Mail gesendet an:", data.email);
        } catch (error) {
            console.error("Fehler beim Senden der Kontaktformular-E-Mail:", error);
            throw error;
        }
    }

    async sendVerificationMail(email: string): Promise<string> {
        const verificationCode = generateVerificationCode();
        
        try {
          await this.client.send({
            from: this.username,
            to: email,
            subject: 'Email Verifizierung',
            html: `
              <h1>Ihr Verifizierungscode</h1>
              <p>Bitte geben Sie den folgenden Code ein, um Ihre Email-Adresse zu verifizieren:</p>
              <h2 style="font-size: 24px; letter-spacing: 5px; background: #f4f4f4; padding: 10px; text-align: center;">
                ${verificationCode}
              </h2>
              <p>Der Code ist 10 Minuten gültig.</p>
            `,
          });
    
          return verificationCode;
        } catch (error) {
          console.error("Fehler beim Senden der Verifikations-Email:", error);
          throw error;
        }
      }

}

export const emailServiceObj = new EmailService(); 