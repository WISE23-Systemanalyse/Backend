import { Context, RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { userRepositoryObj } from "../db/repositories/users.ts";
import { User } from "../db/models/users.ts";
import { verify } from "https://deno.land/x/djwt@v2.2/mod.ts";

export class UserController{
  async getAll(ctx: Context): Promise<void> {
    const users = await userRepositoryObj.findAll();
    ctx.response.body = users;
  }

  async getOne(ctx: RouterContext<string>): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const user = await userRepositoryObj.find(id);
    if (user) {
      ctx.response.body = user;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  }

  async create(ctx: RouterContext<string>): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }
    const contextUser:User = await value.json();
    try {
      const { email, id } = contextUser;
      if (!email || !id) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Email and id are required" };
        return;
      }
    } catch (_e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const user = await userRepositoryObj.create( contextUser );
    ctx.response.status = 201;
    ctx.response.body = user;
  }

  async update(ctx: RouterContext<string>): Promise<void> {
    const authHeader = ctx.request.headers.get("Authorization");
    const jwt = authHeader?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!jwt) {
      ctx.response.status = 401;
      ctx.response.body = { message: "unauthenticated" };
      return;
    }

    try {
      const payload = await verify(jwt, Deno.env.get("JWT_SECRET_KEY")!, "HS256");
      if (!payload || !payload.id) {
        ctx.response.status = 401;
        ctx.response.body = { message: "unauthenticated" };
        return;
      }
      const user = await userRepositoryObj.find(payload.id.toString());
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

    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }
    const ContextUser:User = await value.json();
    const user = await userRepositoryObj.find(id);
    if (user) {
      const updatedUser = await userRepositoryObj.update(id, ContextUser);
      ctx.response.status = 200;
      ctx.response.body = updatedUser;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  }

  async delete(ctx: RouterContext<string>): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }

    // Check if user exists first
    const user = await userRepositoryObj.find(id);
    if (!user) {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
      return;
    }

    await userRepositoryObj.delete(id);
    ctx.response.status = 204;
  }
}

export const userController = new UserController();