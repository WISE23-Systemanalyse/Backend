import { db } from "../db/db.ts";
import { and, eq } from "drizzle-orm";
import { verificationCodes } from "../db/models/verificationCodes.ts";
import { users } from "../db/models/users.ts";
import { userRepositoryObj } from "../db/repositories/users.ts";
import { create } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { InvalidPassword, InvalidVerificationCode, UserAllreadyExists, UserNotFound, UserNotVerified, UserNameAlreadyExists } from "../Errors/UserErrors.ts";
import { emailServiceObj } from "./emailService.ts";
import * as bycript from "https://deno.land/x/bcrypt/mod.ts";

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

      if (!await bycript.compare(password, user.password!)) {
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
        user: custonUser,
        token
      }
    } catch (error) {
      throw error;
    }
  }

  async register(user: any): Promise<void> {
    try {
      let verificationCode: string | null = null;
      
      await db.transaction(async (tx) => {
        // Check if email exists and is verified
        const existingUser = await tx.query.users.findFirst({
          where: eq(users.email, user.email)
        });
  
        if (existingUser?.isVerified) {
          throw new UserAllreadyExists();
        }
  
        // Check if username exists
        const existingUsername = await tx.query.users.findFirst({
          where: eq(users.userName, user.userName)
        });
  
        if (existingUsername) {
          throw new UserNameAlreadyExists();
        }
  
        // Create new user if doesn't exist
        if (!existingUser) {
          await tx.insert(users).values(user);
        }

        const now = new Date();
        const expireAt = new Date(now.getTime() + EXPIRETIME);
  
        // Find existing verification code
        const existingCode = await tx.query.verificationCodes.findFirst({
          where: and(
            eq(verificationCodes.email, user.email),
            eq(verificationCodes.isUsed, false)
          )
        });
  
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
        if (existingCode) {
          await tx
            .update(verificationCodes)
            .set({
              code: verificationCode,
              expiresAt: expireAt
            })
            .where(eq(verificationCodes.id, existingCode.id));
        } else {
          // Create new verification code
          await tx.insert(verificationCodes).values({
            id: crypto.randomUUID(),
            email: user.email,
            code: verificationCode,
            expiresAt: expireAt,
            isUsed: false,
          });
        }
      });

      if (verificationCode) {
        await emailServiceObj.sendVerificationMail(user.email, verificationCode);
      }
  
    } catch (error) {
      throw error;
    }
  }
}

export const userAuthServiceObj = new UserAuthService();
