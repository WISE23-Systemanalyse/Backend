import { assertEquals, assertRejects, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { EmailService } from "../../services/emailService.ts";

// Mock für SMTP-Client
class MockSMTPClient {
  private lastSentMail: any = null;

  async send(options: any) {
    // Speichere die kompletten Mail-Optionen
    this.lastSentMail = {...options};
    return Promise.resolve();
  }

  async close() {
    return Promise.resolve();
  }

  getLastSentMail() {
    return this.lastSentMail;
  }
}

// Hilfsfunktion zum HTML-Escaping Test
function assert(condition: boolean, message = "Assertion failed") {
  if (!condition) {
    throw new Error(message);
  }
}

Deno.test("EmailService - Erweiterte Tests", async (t) => {
  let emailService: EmailService;
  let mockClient: MockSMTPClient;

  await t.step("setup", () => {
    emailService = new EmailService();
    mockClient = new MockSMTPClient();
    // @ts-ignore - Mock für Tests
    emailService["createClient"] = async () => mockClient;
  });

  await t.step("Template Tests", async (t) => {
    await t.step("sollte korrekte Newsletter-Template-Struktur haben", async () => {
      const testEmail = "test@example.com";
      await emailService.sendNewsletterConfirmation(testEmail);
      
      const sentMail = mockClient.getLastSentMail();
      assertEquals(sentMail.to, testEmail);
      assertEquals(sentMail.subject, "Newsletter Anmeldung");
      assertExists(sentMail.html);
      assert(sentMail.html.includes("Willkommen zu unserem Newsletter!"));
    });

    await t.step("sollte korrekte Kontaktformular-Template-Struktur haben", async () => {
      const testData = {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Betreff",
        message: "Test Nachricht"
      };

      await emailService.sendContactFormMail(testData);
      
      const sentMail = mockClient.getLastSentMail();
      assertEquals(sentMail.to, testData.email);
      assertEquals(sentMail.subject, `Kontaktanfrage: ${testData.subject}`);
      assert(sentMail.html.includes(testData.name));
      assert(sentMail.html.includes(testData.message));
    });

    await t.step("sollte korrekte Verifizierungs-Template-Struktur haben", async () => {
      const testEmail = "test@example.com";
      const testCode = "123456";

      await emailService.sendVerificationMail(testEmail, testCode);
      
      const sentMail = mockClient.getLastSentMail();
      assertEquals(sentMail.to, testEmail);
      assertEquals(sentMail.subject, "Email Verifizierung");
      assert(sentMail.html.includes(testCode));
    });
  });

  await t.step("Fehlerbehandlung", async (t) => {
    await t.step("sollte SMTP-Verbindungsfehler korrekt behandeln", async () => {
      // @ts-ignore - Mock für Tests
      emailService["createClient"] = async () => {
        throw new Error("Verbindungsfehler");
      };

      try {
        await emailService.sendNewsletterConfirmation("test@example.com");
        assert(false, "Sollte einen Fehler werfen");
      } catch (error: unknown) {
        if (!(error instanceof Error)) throw error;
        assertEquals(error.message, "Verbindungsfehler");
      }
    });

    await t.step("sollte Client-Schließung-Fehler abfangen", async () => {
      const mockClientWithCloseError = {
        send: async (options: any) => {
          mockClient.send(options);
          return Promise.resolve();
        },
        close: async () => { throw new Error("Schließungsfehler"); }
      };

      // @ts-ignore - Mock für Tests
      emailService["createClient"] = async () => mockClientWithCloseError;

      // Sollte trotz Schließungsfehler erfolgreich sein
      await emailService.sendNewsletterConfirmation("test@example.com");
    });
  });

  await t.step("Performance", async (t) => {
    await t.step("sollte mehrere E-Mails nacheinander senden können", async () => {
      const emails = [
        "test1@example.com",
        "test2@example.com",
        "test3@example.com"
      ];

      for (const email of emails) {
        await emailService.sendNewsletterConfirmation(email);
        const sentMail = mockClient.getLastSentMail();
        assertEquals(sentMail.to, email);
      }
    });
  });
});
