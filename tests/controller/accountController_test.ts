import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { AccountController } from "../../controllers/accountController.ts";
import { userAuthServiceObj } from "../../services/userAuthService.ts";

// Mock RouterContext
const createMockContext = () => {
  return {
    request: {
      body: {
        json: async () => ({})
      }
    },
    response: {
      status: 0,
      body: {}
    }
  };
};

// Mock userAuthService
const mockUserAuthService = {
  register: async () => {},
  verifyUser: async () => {},
  login: async () => "mock-token"
};

Deno.test("AccountController - signup success", async () => {
  const controller = new AccountController();
  const ctx = createMockContext();
  
  // Override request body
  ctx.request.body.json = async () => ({
    email: "test@example.com",
    password: "password123",
    userName: "testuser",
    firstName: "Test",
    lastName: "User"
  });

  // Mock userAuthService
  const originalService = userAuthServiceObj.register;
  userAuthServiceObj.register = mockUserAuthService.register;

  await controller.signup(ctx as any);

  assertEquals(ctx.response.status, 201);
  assertEquals(ctx.response.body, { message: "User created successfully" });

  // Restore original service
  userAuthServiceObj.register = originalService;
});

Deno.test("AccountController - signup validation error", async () => {
  const controller = new AccountController();
  const ctx = createMockContext();
  
  // Missing required fields
  ctx.request.body.json = async () => ({
    email: "test@example.com"
  });

  await controller.signup(ctx as any);

  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { 
    error: "Email and password and UserName are required." 
  });
});

Deno.test("AccountController - verifyEmail success", async () => {
  const controller = new AccountController();
  const ctx = createMockContext();
  
  ctx.request.body.json = async () => ({
    email: "test@example.com",
    code: "123456"
  });

  // Mock userAuthService
  const originalService = userAuthServiceObj.verifyUser;
  userAuthServiceObj.verifyUser = mockUserAuthService.verifyUser;

  await controller.verifyEmail(ctx as any);

  assertEquals(ctx.response.status, 201);
  assertEquals(ctx.response.body, { message: "User verified successfully" });

  // Restore original service
  userAuthServiceObj.verifyUser = originalService;
});

Deno.test("AccountController - verifyEmail validation error", async () => {
  const controller = new AccountController();
  const ctx = createMockContext();
  
  // Missing code
  ctx.request.body.json = async () => ({
    email: "test@example.com"
  });

  await controller.verifyEmail(ctx as any);

  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "Email and code are required." });
});

Deno.test("AccountController - signin success", async () => {
  const controller = new AccountController();
  const ctx = createMockContext();
  
  ctx.request.body.json = async () => ({
    email: "test@example.com",
    password: "password123"
  });

  // Mock userAuthService
  const originalService = userAuthServiceObj.login;
  userAuthServiceObj.login = mockUserAuthService.login;

  await controller.signin(ctx as any);

  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, { token: "mock-token" });

  // Restore original service
  userAuthServiceObj.login = originalService;
});

Deno.test("AccountController - signin validation error", async () => {
  const controller = new AccountController();
  const ctx = createMockContext();
  
  // Missing password
  ctx.request.body.json = async () => ({
    email: "test@example.com"
  });

  await controller.signin(ctx as any);

  assertEquals(ctx.response.status, 400);
  assertEquals(ctx.response.body, { error: "Email and password are required." });
});

// Test error handling
Deno.test("AccountController - signup service error", async () => {
  const controller = new AccountController();
  const ctx = createMockContext();
  
  ctx.request.body.json = async () => ({
    email: "test@example.com",
    password: "password123",
    userName: "testuser"
  });

  // Mock service to throw error
  const originalService = userAuthServiceObj.register;
  userAuthServiceObj.register = async () => {
    throw new Error("Service error");
  };

  await controller.signup(ctx as any);

  assertEquals(ctx.response.status, 500);
  assertEquals(ctx.response.body, { error: "Service error" });

  // Restore original service
  userAuthServiceObj.register = originalService;
});
