import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { users } from "../db/models/users.ts";
import { db } from "../db/db.ts";
import { userRepository } from "../db/repositories/users.ts";

const SECRET_KEY = "your-secret-key-at-least-32-chars-long"; // Ersetze durch einen sicheren Schlüssel

export class AccountController {
  async signup(ctx: RouterContext<'/signup'>): Promise<void> {
    try {
      const body = await ctx.request.body;
      const { email, password, firstName, lastName, userName, imageUrl, isAdmin } = await body.json();

      if (!email || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Email and password are required." };
        return;
      }

      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        firstName,
        lastName,
        userName,
        imageUrl,
        isAdmin: isAdmin || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(users).values(newUser);
      
      const token = await create(
        { alg: "HS256", typ: "JWT" },
        { id: newUser.id, email: newUser.email },
        SECRET_KEY
      );

      ctx.response.status = 201;
      ctx.response.body = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userName: newUser.userName,
        imageUrl: newUser.imageUrl,
        isAdmin: newUser.isAdmin,
        token,
      };

    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: error.message };
    }
  }
  async signin(ctx: RouterContext<'/sigin'>): Promise<void> {
    try {
      const body = await ctx.request.body;
      const { email, password } = await body.json();

      if (!email || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Email and password are required." };
        return;
      }

      const user = await userRepository.findByEmail(email);

      if (!user || !(await password === user.password)) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid email or password." };
        return;
      }

      const token = await create(
        { alg: "HS256", typ: "JWT" },
        { 
          id: user.id,
          email: user.email,
          userName: user.userName
        },
        SECRET_KEY
      );

      ctx.response.status = 200;
      ctx.response.body = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        imageUrl: user.imageUrl,
        token
      };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error." };
    }
  }

  async me(ctx: RouterContext<'/me'>): Promise<void> {
    const jwt = await ctx.cookies.get("jwt");
    console.log(jwt);
  
    if (!jwt) {
      ctx.response.status = 401;
      ctx.response.body = { message: 'unauthenticated' };
      return;
    }
  
    try {
      const payload = await verify(jwt, SECRET_KEY, "HS256");
      if (!payload) {
        ctx.response.status = 401;
        ctx.response.body = { message: 'unauthenticated' };
        return;
      }
  
      const user = await userRepository.find(payload.id);
      if (user) {
        ctx.response.status = 200;
        ctx.response.body = { message: user };
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "User not found." };
      }
    } catch (error) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Invalid or expired token." };
    }
  }
  
}

export const accountController = new AccountController();
