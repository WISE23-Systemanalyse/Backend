import { db } from "../db.ts";
import { verificationCodes, VerificationCode } from "../models/verificationCodes.ts";
import { eq } from "drizzle-orm";
import { BaseRepository } from "./baseRepository.ts";


export class VerificationCodeRepository extends BaseRepository<VerificationCode> {
    constructor() {
        super(verificationCodes);
    }
    async findByEmail(code: VerificationCode['code']): Promise<VerificationCode | null> {
        const result = await db.query.verificationCodes.findFirst({
            where: eq(verificationCodes.code, code),
          });
          return result ?? null;
    }
}

export const verificationCodeRepositoryObj = new VerificationCodeRepository();