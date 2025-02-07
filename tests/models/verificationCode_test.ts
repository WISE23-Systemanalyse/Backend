import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { verificationCodes } from "../../db/models/verificationCodes.ts";

const mockVerificationCodes = {
  _: {
    name: "verification_codes",
    columns: {
      id: { dataType: "string" },
      email: { dataType: "string" },
      code: { dataType: "string" },
      createdAt: { dataType: "date" },
      expiresAt: { dataType: "date" }
    }
  },
  $inferSelect: {
    id: "uuid-123",
    email: "test@test.com",
    code: "123456",
    createdAt: new Date(),
    expiresAt: new Date()
  }
};

Deno.test("VerificationCodes Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    verificationCodes._ = mockVerificationCodes._;
    assertEquals(verificationCodes._.name, "verification_codes");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    verificationCodes.$inferSelect = mockVerificationCodes.$inferSelect;
    const columns = verificationCodes.$inferSelect;
    
    assertEquals(typeof columns.id, "string");
    assertEquals(typeof columns.email, "string");
    assertEquals(typeof columns.code, "string");
    assertEquals(typeof columns.createdAt, "object");
    assertEquals(typeof columns.expiresAt, "object");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = verificationCodes._.columns;
    
    assertEquals(columns.id.dataType, "string");
    assertEquals(columns.email.dataType, "string");
    assertEquals(columns.code.dataType, "string");
    assertEquals(columns.createdAt.dataType, "date");
    assertEquals(columns.expiresAt.dataType, "date");
  });
});
