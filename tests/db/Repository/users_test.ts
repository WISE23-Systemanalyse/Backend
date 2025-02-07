import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { UserRepository } from "../../../db/repositories/users.ts";
import { db } from "../../../db/db.ts";
import { User } from "../../../db/models/users.ts";

// Mock data for tests
const mockUsers: User[] = [
  { 
    id: '1', 
    email: 'user1@test.com', 
    password: 'hash1',
    firstName: null,
    lastName: null,
    userName: null,
    imageUrl: null,
    createdAt: null,
    updatedAt: null,
    isAdmin: true,
    isVerified: null
  },
  { 
    id: '2', 
    email: 'user2@test.com', 
    password: 'hash2',
    firstName: null,
    lastName: null,
    userName: null,
    imageUrl: null,
    createdAt: null,
    updatedAt: null,
    isAdmin: false,
    isVerified: null
  },
  { 
    id: '3', 
    email: 'user3@test.com', 
    password: 'hash3',
    firstName: null,
    lastName: null,
    userName: null,
    imageUrl: null,
    createdAt: null,
    updatedAt: null,
    isAdmin: false,
    isVerified: null
  }
];

Deno.test('UserRepository - find by id', async () => {
  const originalQuery = db.query;
  db.query = {
    users: {
      findFirst: () => Promise.resolve(mockUsers[0])
    }
  } as any;

  try {
    const repository = new UserRepository();
    const result = await repository.find('1');

    assertExists(result);
    assertEquals(result.email, 'user1@test.com');
    assertEquals(result.isAdmin, true);
    assertEquals(result.password, undefined); // Password should be excluded
  } finally {
    db.query = originalQuery;
  }
});

Deno.test('UserRepository - findAll', async () => {
  const originalSelect = db.select;
  db.select = () => ({
    from: () => mockUsers
  }) as any;

  try {
    const repository = new UserRepository();
    const result = await repository.findAll();

    assertExists(result);
    assertEquals(result.length, 3);
    assertEquals(result[0].email, 'user1@test.com');
    assertEquals(result[0].password, undefined); // Password should be excluded
  } finally {
    db.select = originalSelect;
  }
});

Deno.test('UserRepository - create', async () => {
  const newUser = {
    email: 'new@test.com',
    password: 'hashedPassword',
    firstName: null,
    lastName: null,
    userName: null,
    imageUrl: null,
    createdAt: null,
    updatedAt: null,
    isAdmin: false,
    isVerified: null
  };
  
  const originalInsert = db.insert;
  db.insert = () => ({
    values: () => ({
      returning: () => [{
        id: '4',
        ...newUser
      }]
    })
  }) as any;

  try {
    const repository = new UserRepository();
    const result = await repository.create(newUser);

    assertExists(result);
    assertEquals(result.email, 'new@test.com');
    assertEquals(result.isAdmin, false);
    assertExists(result.id);
  } finally {
    db.insert = originalInsert;
  }
});

Deno.test('UserRepository - findByEmail', async () => {
  const originalQuery = db.query;
  db.query = {
    users: {
      findFirst: () => Promise.resolve(mockUsers[0])
    }
  } as any;

  try {
    const repository = new UserRepository();
    const result = await repository.findByEmail('user1@test.com');

    assertExists(result);
    assertEquals(result.email, 'user1@test.com');
    assertEquals(result.isAdmin, true);
    assertEquals(result.password, 'hash1'); // Password included in findByEmail
  } finally {
    db.query = originalQuery;
  }
});

Deno.test('UserRepository - findByEmail returns null for non-existent email', async () => {
  const originalQuery = db.query;
  db.query = {
    users: {
      findFirst: () => Promise.resolve(null)
    }
  } as any;

  try {
    const repository = new UserRepository();
    const result = await repository.findByEmail('nonexistent@test.com');

    assertEquals(result, null);
  } finally {
    db.query = originalQuery;
  }
});
