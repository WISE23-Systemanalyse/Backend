import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { userAuthServiceObj } from "../services/userAuthService.ts";


export class AccountController {
  async signup(ctx: RouterContext<"/signup">): Promise<void> {
    try {
      const body = await ctx.request.body;
      const { email, password, firstName, lastName, userName } = await body
        .json();

      if (!email || !password || !userName) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Email and password and UserName are required." };
        return;
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
        throw error;  
      }

    } catch (error) {
      ctx.response.status = error.status || 500;
      ctx.response.body = { error: error.message };
    }
  }

  async verifyEmail(ctx: RouterContext<"/verifyemail">): Promise<void> {
    try {
      const body = await ctx.request.body;
      const { email, code } = await body.json();

      if (!email || !code) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Email and code are required." };
        return;
      }

      // Führe alle DB-Operationen in einer Transaktion aus
      try {
        await userAuthServiceObj.verifyUser(email, code);
        ctx.response.status = 201;
        ctx.response.body = { message: "User verified successfully" };
      } catch (error) {
        ctx.response.status = error.status || 500;
        ctx.response.body = { error: error.message };
      }
    } catch (error) {
      ctx.response.status = error.status || 500;
      ctx.response.body = { error: error.message };
    }
  }

  async signin(ctx: RouterContext<"/signin">): Promise<void> {
    try {
      const body = await ctx.request.body;
      const { email, password } = await body.json();

      if (!email || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Email and password are required." };
        return;
      }
      try {
        const token = await userAuthServiceObj.login(email, password);
        ctx.response.status = 200;
        ctx.response.body = {
        "token":token,
      };
      } catch (error) {
        ctx.response.status = error.status;
        ctx.response.body = { error: error.message };
      }
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
    }
  }

}

export const accountController = new AccountController();
