import { db } from "../db/db.ts";
import { eq } from "drizzle-orm";
import { verificationCodes } from "../db/models/verificationCodes.ts";
import { users } from "../db/models/users.ts";
import { userRepositoryObj } from "../db/repositories/users.ts";
import { create } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { InvalidPassword, InvalidVerificationCode, UserAllreadyExists, UserNotFound, UserNotVerified } from "../Errors/UserErrors.ts";
import { emailServiceObj } from "./emailService.ts";

const EXPIRETIME = 1000 * 60 * 60 * 24; // 24 hours

export class UserAuthService {
  async verifyUser(email: string, code: string): Promise<void> {
     await db.transaction(async (tx) => {
      // Find verification code
      const [verificationCode] = await tx
        .select()
        .from(verificationCodes)
        .where(
          eq(verificationCodes.email, email)
        );

      // Validate verification code
      if (!verificationCode || 
          verificationCode.code !== code ||
          verificationCode.isUsed ||
          new Date() > verificationCode.expiresAt) {
        throw new InvalidVerificationCode();
      }

      // Update verification status
      await tx
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.email, email));

      // Mark verification code as used
      await tx
        .update(verificationCodes)
        .set({ isUsed: true })
        .where(eq(verificationCodes.id, verificationCode.id));
    });
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const user = await userRepositoryObj.findByEmail(email);
      if (!user) {
        throw new UserNotFound();
      }
      if (user.password !== password) {
        throw new InvalidPassword();
      }
      if(!user.isVerified) {
        throw new UserNotVerified();
      }
      const token = await create(
        { alg: "HS256", typ: "JWT" },
        {
          id: user.id,
          email: user.email,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
        },
        Deno.env.get("JWT_SECRET_KEY")!,
      );
      const { password: _password, isAdmin: _isAdmin, ...custonUser } = user;
      return {
        ...custonUser,
        token
      }
    } catch (error) {
      throw error;
    }
  }

  async register(user: any): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        const isUserExist = await tx.query.users.findFirst({
          where: eq(users.email, user.email),
        });
        if (isUserExist) {
          throw new UserAllreadyExists();
        }
        const [createdUser] = await tx.insert(users).values(user).returning();
        const now = new Date();
        const expireAt = new Date(now.getTime() + EXPIRETIME);
        try {
          const verificationCode = await emailServiceObj.sendVerificationMail(user.email);
          await tx.insert(verificationCodes).values({
            id: crypto.randomUUID(),
            email: user.email,
            code: verificationCode,
            expiresAt: expireAt,
            isUsed: false,
          });
        } catch (error) {
          throw error;
        }
        
      });      
    } catch (error) {
      throw error
    }
  }
}

export const userAuthServiceObj = new UserAuthService();
