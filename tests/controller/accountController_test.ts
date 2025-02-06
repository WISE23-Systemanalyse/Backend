import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { userAuthServiceObj } from "../../services/userAuthService.ts";
import { AccountController } from "../../controllers/accountController.ts";

// Mock für RouterContext
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
  } as unknown as RouterContext<"/signup" | "/signin" | "/verifyemail">;
};

// Mock für userAuthServiceObj
const mockUserAuthService = {
  register: async () => {},
  verifyUser: async () => {},
  login: async () => "mock-token"
};

Deno.test("AccountController Tests", async (t) => {
  const controller = new AccountController();


  
  userAuthServiceObj.register = mockUserAuthService.register;
  userAuthServiceObj.verifyUser = mockUserAuthService.verifyUser;
  userAuthServiceObj.login = mockUserAuthService.login;

  await t.step("signup - should create user successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      email: "test@test.com",
      password: "password123",
      userName: "testuser",
      firstName: "Test",
      lastName: "User"
    });

    await controller.signup(ctx as RouterContext<"/signup">);
    
    assertEquals(ctx.response.status, 201);
    assertEquals(ctx.response.body, { message: "User created successfully" });
  });

  await t.step("signup - should return 400 for missing required fields", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      email: "test@test.com",
      password: "password123"
      // userName missing
    });

    await controller.signup(ctx as RouterContext<"/signup">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { error: "Email and password and UserName are required." });
  });

  await t.step("signin - should login successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      email: "test@test.com",
      password: "password123"
    });

    await controller.signin(ctx as RouterContext<"/signin">);
    
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, { token: "mock-token" });
  });

  await t.step("signin - should return 400 for missing credentials", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      email: "test@test.com"
      // password missing
    });

    await controller.signin(ctx as RouterContext<"/signin">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { error: "Email and password are required." });
  });

  await t.step("verifyEmail - should verify email successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      email: "test@test.com",
      code: "123456"
    });

    await controller.verifyEmail(ctx as RouterContext<"/verifyemail">);
    
    assertEquals(ctx.response.status, 201);
    assertEquals(ctx.response.body, { message: "User verified successfully" });
  });

  await t.step("verifyEmail - should return 400 for missing fields", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      email: "test@test.com"
      // code missing
    });

    await controller.verifyEmail(ctx as RouterContext<"/verifyemail">);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { error: "Email and code are required." });
  });

});
