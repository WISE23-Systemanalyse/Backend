import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { UserRepository } from "../../../db/repositories/users.ts";
import { mockUser } from "../../mocks/userRepositoryMocks.ts";

Deno.test("UserRepository.findByEmail should return user", async () => {
  const mockDb = {
    query: {
      users: {
        findFirst: () => Promise.resolve(mockUser)
      }
    }
  };

  const repository = new UserRepository();
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  const result = await repository.findByEmail("test@test.com");
  assertEquals(result, mockUser);
});

Deno.test("UserRepository.findByEmail should return null if not found", async () => {
  const mockDb = {
    query: {
      users: {
        findFirst: () => Promise.resolve(null)
      }
    }
  };

  const repository = new UserRepository();
  // @ts-ignore - Für Tests überschreiben wir die protected db
  repository.db = mockDb;
  const result = await repository.findByEmail("nonexistent@test.com");
  assertEquals(result, null);
}); 