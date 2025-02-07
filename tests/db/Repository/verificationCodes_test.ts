import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { VerificationCodeRepository } from "../../../db/repositories/verficationCodes.ts";
import { db } from "../../../db/db.ts";
import { VerificationCode } from "../../../db/models/verificationCodes.ts";

// Mock data for tests
const mockVerificationCodes: VerificationCode[] = [
  { 
    id: '1',
    code: 'abc123',
    email: 'test1@example.com',
    expiresAt: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
  },
  { 
    id: '2',
    code: 'def456',
    email: 'test2@example.com',
    expiresAt: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
  }
];


Deno.test('VerificationCodeRepository - findAll', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => mockVerificationCodes
  }) as any;

  try {
    const repository = new VerificationCodeRepository();
    const result = await repository.findAll();

    assertExists(result);
    assertEquals(result.length, 2);
    assertEquals(result[0].code, 'abc123');
    assertEquals(result[0].email, 'test1@example.com');
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('VerificationCodeRepository - create', async () => {
  const newCode = {
    code: 'xyz789',
    email: 'test3@example.com',
    expiresAt: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
  };
  
  const originalInsert = db.insert;
  db.insert = () => ({
    values: () => ({
      returning: () => [{
        id: '3',
        ...newCode
      }]
    })
  }) as any;

  try {
    const repository = new VerificationCodeRepository();
    const result = await repository.create(newCode);

    assertExists(result);
    assertEquals(result.code, 'xyz789');
    assertEquals(result.email, 'test3@example.com');
    assertExists(result.id);
  } finally {
    db.insert = originalInsert;
  }
});

Deno.test('VerificationCodeRepository - findByCode', async () => {
  const originalQuery = db.query;
  db.query = {
    verificationCodes: {
      findFirst: () => Promise.resolve(mockVerificationCodes[0])
    }
  } as any;

  try {
    const repository = new VerificationCodeRepository();
    const result = await repository.findByEmail('abc123');

    assertExists(result);
    assertEquals(result.code, 'abc123');
    assertEquals(result.email, 'test1@example.com');
  } finally {
    db.query = originalQuery;
  }
});

Deno.test('VerificationCodeRepository - findByCode returns null for non-existent code', async () => {
  const originalQuery = db.query;
  db.query = {
    verificationCodes: {
      findFirst: () => Promise.resolve(null)
    }
  } as any;

  try {
    const repository = new VerificationCodeRepository();
    const result = await repository.findByEmail('nonexistent');

    assertEquals(result, null);
  } finally {
    db.query = originalQuery;
  }
});
