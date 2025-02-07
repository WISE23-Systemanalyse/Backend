import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { userRepositoryObj } from "../../db/repositories/users.ts";
import { UserController } from "../../controllers/userController.ts";
import { User } from "../../db/models/users.ts";

// Mock for RouterContext
const createMockContext = () => {
  return {
    params: {},
    request: {
      headers: new Headers(),
      body: {
        json: async () => ({})
      }
    },
    response: {
      status: 0,
      body: null as any,
    }
  } as unknown as RouterContext<string>;
};

// Mock repository
const mockUserRepository = {
  findAll: async () => [{ id: "1", email: "test@test.com" }],
  find: async (id: string) => ({ id, email: "test@test.com" }),  // This ensures find returns a user
  create: async (data: any) => ({ id: "1", ...data }),
  update: async (id: string, data: any) => ({ id, ...data }),
  delete: async (id: string) => ({ id, email: "test@test.com" })
};

Deno.test("UserController Tests", async (t) => {
  const controller = new UserController();

  // Mock repository methods
  Object.assign(userRepositoryObj, mockUserRepository);

  await t.step("getAll - should return all users", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx);
    
    assertEquals(ctx.response.body, [{ id: "1", email: "test@test.com" }]);
  });

  await t.step("getOne - should return specific user", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };

    await controller.getOne(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.body, { id: "1", email: "test@test.com" });
  });

  await t.step("getOne - should return 404 for non-existent user", async () => {
    const mockUserRepo = { ...mockUserRepository, find: async () => null };
    Object.assign(userRepositoryObj, mockUserRepo);
    
    const ctx = createMockContext();
    ctx.params = { id: "999" };

    await controller.getOne(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "User not found" });
  });

  await t.step("create - should create user successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      id: "2",
      email: "new@example.com"
    });

    await controller.create(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 201);
    assertEquals(ctx.response.body, { id: "2", email: "new@example.com" });
  });

  await t.step("create - should return 400 for missing email", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      id: "2"
    });

    await controller.create(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Email and id are required" });
  });


  await t.step("delete - should delete user successfully", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    
    // Reset repository mock to ensure find returns a user
    Object.assign(userRepositoryObj, mockUserRepository);
    
    await controller.delete(ctx);
    assertEquals(ctx.response.status, 204);
  });

  await t.step("delete - should return 404 for non-existent user", async () => {
    const mockUserRepo = { ...mockUserRepository, find: async () => null };
    Object.assign(userRepositoryObj, mockUserRepo);
    
    const ctx = createMockContext();
    ctx.params = { id: "999" };

    await controller.delete(ctx as RouterContext<string>);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "User not found" });
  });
});
