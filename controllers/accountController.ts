import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { users } from "../db/models/users.ts";
import { db } from "../db/db.ts";
import { userRepository } from "../db/repositories/users.ts";

const SECRET_KEY = "your-secret-key"; // Ersetze durch einen sicheren Schlüssel

export class AccountController {
  async signup(ctx: RouterContext<'/signup'>): Promise<void> {
    try {
      const body = await ctx.request.body.json()
      const { email, password, firstName, lastName, userName, imageUrl, isAdmin } = body.value;

      if (!email || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Email and password are required." };
        return;
      }

      const newUser = {
        id: crypto.randomUUID(),
        email,
        password: password,
        firstName,
        lastName,
        userName,
        imageUrl,
        isAdmin: isAdmin || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(users).values(newUser);

      ctx.response.status = 201;
      ctx.response.body = { message: "User created successfully." };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error." };
    }
  }

  async login(ctx: RouterContext<'/login'>): Promise<void> {
    try {
      const body = await ctx.request.body.json();
      const { email, password } = await body.value;

      if (!email || !password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Email and password are required." };
        return;
      }

      const user = await userRepository.findByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid email or password." };
        return;
      }

      const jwt = await create({ alg: "HS256", typ: "JWT" }, { id: user.id, email: user.email }, SECRET_KEY);

      ctx.response.status = 200;
      ctx.response.body = { token: jwt, message: "Login successful." };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error." };
    }
  }

  async logout(ctx: RouterContext<'/logout'>): Promise<void> {
    ctx.response.status = 200;
    ctx.response.body = { message: "Logout successful." };
  }

  async me(ctx: RouterContext<'/me'>): Promise<void> {
    try {
      const authHeader = ctx.request.headers.get("Authorization");

      if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Authorization header missing." };
        return;
      }

      const token = authHeader.replace("Bearer ", "");
      const payload = await verify(token, SECRET_KEY, "HS256");
      
      const user = await userRepository.find(payload!.id);
      
      if (!user) {
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found." };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = { user };
    } catch (error) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Invalid or expired token." };
    }
  }
}

export const accountController = new AccountController();
