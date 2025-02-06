import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { UserAuthService } from "../../services/userAuthService.ts";
import { 
  InvalidPassword, 
  InvalidVerificationCode, 
  UserAllreadyExists, 
  UserNotFound, 
  UserNotVerified,
  UserNameAlreadyExists 
} from "../../Errors/UserErrors.ts";
import { db } from "../../db/db.ts";
import { userRepositoryObj } from "../../db/repositories/users.ts";
import { emailServiceObj } from "../../services/emailService.ts";

// Mock User
const mockUser = {
  id: "1",
  email: "test@example.com",
  password: "$2a$10$gM8U3/duYhunPFb08DK/7.ypgeHkqPgTQ666He86qKcGKPLTkdJdO", // Hash für "password123"
  userName: "testuser",
  isVerified: true,
  firstName: "Test",
  lastName: "User",
  imageUrl: "test.jpg",
  createdAt: new Date(),
  isAdmin: false
};

// Mock Transaction
const mockTransaction = async (callback: (tx: any) => Promise<void>) => {
  const mockTx = {
    select: () => ({ 
      from: () => ({ 
        where: () => [{ 
          id: "code1", 
          email: "test@example.com", 
          code: "123456", 
          expiresAt: new Date(Date.now() + 3600000) 
        }] 
      }) 
    }),
    update: () => ({ set: () => ({ where: () => {} }) }),
    delete: () => ({ where: () => {} }),
    insert: () => ({ values: () => {} }),
    query: {
      users: {
        findFirst: () => null
      },
      verificationCodes: {
        findFirst: () => null
      }
    }
  };
  return await callback(mockTx);
};

// Mock Repository
userRepositoryObj.findByEmail = async (email: string) => {
  if (email === "test@example.com") return {
    ...mockUser,
    updatedAt: null
  };
  throw new UserNotFound();
};

// Mock Email Service
emailServiceObj.sendVerificationMail = async () => "verification-id";

// Mock JWT Secret
Deno.env.set("JWT_SECRET_KEY", "test-secret-key");

Deno.test("UserAuthService Tests", async (t) => {
  const service = new UserAuthService();

  // Mock db.transaction
  // @ts-ignore
  db.transaction = mockTransaction;

  await t.step("Benutzerregistrierung", async (t) => {
    await t.step("sollte einen neuen Benutzer registrieren", async () => {
      const newUser = {
        email: "new@example.com",
        password: "password123",
        userName: "newuser"
      };

      await service.register(newUser);
    });

    await t.step("sollte Fehler werfen bei existierendem Benutzer", async () => {
      // @ts-ignore - Mock query für existierenden Benutzer
      db.transaction = async (callback: (tx: any) => Promise<void>) => {
        const mockTx = {
          query: {
            users: {
              findFirst: () => ({ ...mockUser, isVerified: true })
            }
          }
        };
        return await callback(mockTx);
      };

      try {
        await service.register(mockUser);
        throw new Error("Sollte einen Fehler werfen");
      } catch (error: unknown) {
        assertEquals((error as Error).message, "User Allready Exists");
      }
    });
  });

  await t.step("Benutzeranmeldung", async (t) => {
    await t.step("sollte erfolgreiche Anmeldung durchführen", async () => {
      const result = await service.login("test@example.com", "password123");
      assertEquals(typeof result.token, "string");
      assertEquals(result.user.email, "test@example.com");
    });

    await t.step("sollte Fehler werfen bei nicht existierendem Benutzer", async () => {
      try {
        await service.login("nonexistent@example.com", "password123");
        throw new Error("Sollte einen Fehler werfen");
      } catch (error: unknown) {
        assertEquals((error as Error).message, "User not Found");
      }
    });

    await t.step("sollte Fehler werfen bei falschem Passwort", async () => {
      try {
        await service.login("test@example.com", "wrongpassword");
        throw new Error("Sollte einen Fehler werfen");
      } catch (error: unknown) {
        assertEquals((error as Error).message, "Invalid Password");
      }
    });
  });

  await t.step("Benutzerverifizierung", async (t) => {
    // Reset mock transaction für Verifizierungstests
    // @ts-ignore
    db.transaction = mockTransaction;

    await t.step("sollte Benutzer erfolgreich verifizieren", async () => {
      await service.verifyUser("test@example.com", "123456");
    });

    await t.step("sollte Fehler werfen bei ungültigem Code", async () => {
      try {
        await service.verifyUser("test@example.com", "wrong-code");
        throw new Error("Sollte einen Fehler werfen");
      } catch (error: unknown) {
        assertEquals((error as Error).message, "Invalid Verification Code");
      }
    });
  });
});
