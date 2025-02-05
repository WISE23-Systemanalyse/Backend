import { Context, RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { categoryRepositoryObj } from "../db/repositories/categories.ts";
import { Category } from "../db/models/categories.ts";

export class CategoryController implements Controller<Category> {
  async getAll(ctx: RouterContext<string>): Promise<void> {
    const categories = await categoryRepositoryObj.findAll();
    ctx.response.body = categories;
  }

  async getOne(ctx: RouterContext<string>): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    const category = await categoryRepositoryObj.find(id);
    if (category) {
      ctx.response.body = category;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Category not found" };
    }
  }

  async create(ctx: RouterContext<string>): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }
    const contextCategory: Category = await value.json();
    try {
      const { category_name } = contextCategory;
      if (!category_name) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Name is required" };
        return;
      }
    } catch (e) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid JSON" };
      return;
    }
    const category = await categoryRepositoryObj.create(contextCategory);
    ctx.response.status = 201;
    ctx.response.body = category;
  }

  async update(ctx: RouterContext<string>): Promise<void> {
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
    const contextCategory: Category = await value.json();
    const category = await categoryRepositoryObj.find(contextCategory.id);
    if (category) {
      console.log(contextCategory);
      const updatedCategory = await categoryRepositoryObj.update(
        contextCategory.id, 
        contextCategory
      );
      ctx.response.status = 200;
      ctx.response.body = updatedCategory;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Category not found" };
    }
  }

  async delete(ctx: Context): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter is required" };
      return;
    }
    await categoryRepositoryObj.delete(id);
    ctx.response.status = 204;
  }

  async bulkCreate(ctx: RouterContext<"/categories/bulk">): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const categories = await value.json();
    if (!Array.isArray(categories)) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body must be an array of categories" };
      return;
    }

    try {
      const createdCategories = await Promise.all(
        categories.map((category) => categoryRepositoryObj.create(category))
      );
      ctx.response.status = 201;
      ctx.response.body = createdCategories;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }

  async bulkUpdate(ctx: RouterContext<"/categories/bulk">): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const categories = await value.json();
    if (!Array.isArray(categories)) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body must be an array of categories" };
      return;
    }

    try {
      const updatedCategories = await Promise.all(
        categories.map((category) => categoryRepositoryObj.update(category.id, category))
      );
      ctx.response.body = updatedCategories;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }

  async bulkDelete(ctx: RouterContext<"/categories/bulk">): Promise<void> {
    const value = await ctx.request.body;
    if (!value) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Request body is required" };
      return;
    }

    const categoryIds = await value.json();
    if (!Array.isArray(categoryIds)) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Request body must be an array of category IDs",
      };
      return;
    }

    try {
      await Promise.all(categoryIds.map((id) => categoryRepositoryObj.delete(id)));
      ctx.response.status = 204;
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: error.message };
    }
  }
}

export const categoryController = new CategoryController();

