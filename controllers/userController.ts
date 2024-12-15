import { Context } from "https://deno.land/x/oak/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { userRepository } from "../db/repositories/users.ts";
import { User } from "../db/models/users.ts";

export class UserController implements Controller<User> {
  async getAll(ctx: Context): Promise<void> {
    const users = await userRepository.findAll();
    ctx.response.body = users;
  }

  async getOne(ctx: Context): Promise<void> {
    const { id }= ctx.params; 
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const user = await userRepository.find(id);
    if (user) {
      ctx.response.body = user;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  }

  async create(ctx: Context): Promise<void> {
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
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const user = await userRepository.create( contextUser );
    ctx.response.status = 201;
    ctx.response.body = user;
  }

  async update(ctx: Context): Promise<void> {
    const id = ctx.request.url.searchParams.get("id");
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
    const user = await userRepository.find(id);
    if (user) {
      const updatedUser = await userRepository.update(id, ContextUser);
      ctx.response.status = 200;
      ctx.response.body = updatedUser;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  }

  async delete(ctx: Context): Promise<void> {
    const id = ctx.request.url.searchParams.get("id");
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const user = await userRepository.find(id);
    if (user) {
      await userRepository.delete(id);
      ctx.response.status = 204;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  }
}

export const userController = new UserController();