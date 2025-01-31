import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { verificationCodes, VerificationCode } from "../models/verificationCodes.ts";
import { eq } from "drizzle-orm";


export class VerificationCodeRepository implements Repository<VerificationCode> {
    async findAll(): Promise<VerificationCode[]> {
        const allVerificationCodes = await db.select().from(verificationCodes);
        return allVerificationCodes;
    }
    async find(id: VerificationCode['id']): Promise< VerificationCode | null> {
        const result = await db.query.verificationCodes.findFirst({
            where: eq(verificationCodes.id, id),
          });
          return result ?? null;
    }
    async delete(id: VerificationCode['id']): Promise<void> {
        await db.delete(verificationCodes).where(eq(verificationCodes.id, id));
    }
    async create(value: any): Promise<VerificationCode> {
      const [verificationCode] = await db.insert(verificationCodes).values(value).returning();
      return verificationCode;
    }
    async update(id: VerificationCode['id'], value: any): Promise<VerificationCode> {
        const [updatedVerificationCode] = await db.update(verificationCodes).set(value).where(eq(verificationCodes.id, id)).returning();
        return updatedVerificationCode;
    }
    async findByEmail(code: VerificationCode['code']): Promise<VerificationCode | null> {
        const result = await db.query.verificationCodes.findFirst({
            where: eq(verificationCodes.code, code),
          });
          return result ?? null;
    }
}

export const verificationCodeRepositoryObj = new VerificationCodeRepository();