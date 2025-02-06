import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { userAuthServiceObj } from "../services/userAuthService.ts";

// Custom Error Klasse für bessere Typisierung
class CustomError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}

export class AccountController {
  async signup(ctx: RouterContext<"/signup">): Promise<void> {
    try {
      const body = await ctx.request.body;
      const { email, password, firstName, lastName, userName } = await body
        .json();

      if (!email || !password || !userName) {
        throw new CustomError("Email and password and UserName are required.", 400);
      }
      
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        firstName,
        lastName,
        userName,
        imageUrl: "",
        createdAt: new Date(),
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        isAdmin: false,
        isVerified: false,
      };
      
      try {
        await userAuthServiceObj.register(newUser);
        ctx.response.status = 201;
        ctx.response.body = { message: "User created successfully" };
      } catch (error) {
        if (error instanceof Error) {
          throw new CustomError(error.message, 500);
        }
        throw new CustomError("An unknown error occurred", 500);
      }

    } catch (error) {
      if (error instanceof CustomError) {
        ctx.response.status = error.status;
        ctx.response.body = { error: error.message };
      } else {
        ctx.response.status = 500;
        ctx.response.body = { error: "An unknown error occurred" };
      }
    }
  }

  async verifyEmail(ctx: RouterContext<"/verifyemail">): Promise<void> {
    try {
      const body = await ctx.request.body;
      const { email, code } = await body.json();

      if (!email || !code) {
        throw new CustomError("Email and code are required.", 400);
      }

      try {
        await userAuthServiceObj.verifyUser(email, code);
        ctx.response.status = 201;
        ctx.response.body = { message: "User verified successfully" };
      } catch (error) {
        if (error instanceof Error) {
          throw new CustomError(error.message, 500);
        }
        throw new CustomError("An unknown error occurred", 500);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        ctx.response.status = error.status;
        ctx.response.body = { error: error.message };
      } else {
        ctx.response.status = 500;
        ctx.response.body = { error: "An unknown error occurred" };
      }
    }
  }

  async signin(ctx: RouterContext<"/signin">): Promise<void> {
    try {
      const body = await ctx.request.body;
      const { email, password } = await body.json();

      if (!email || !password) {
        throw new CustomError("Email and password are required.", 400);
      }
      
      try {
        const token = await userAuthServiceObj.login(email, password);
        ctx.response.status = 200;
        ctx.response.body = {
          "token": token,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new CustomError(error.message, 401);
        }
        throw new CustomError("An unknown error occurred", 500);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        ctx.response.status = error.status;
        ctx.response.body = { error: error.message };
      } else {
        ctx.response.status = 500;
        ctx.response.body = { error: "An unknown error occurred" };
      }
    }
  }
}

export const accountController = new AccountController();
