import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { categoryRepositoryObj } from "../../db/repositories/categories.ts";
import { CategoryController } from "../../controllers/categoryController.ts";
import { Category } from "../../db/models/categories.ts";

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
    },
    params: {}
  } as unknown as RouterContext<string>;
};

// Mock für categoryRepositoryObj
const mockCategoryRepository = {
  findAll: async () => [{ id: 1, category_name: "Test Category", surcharge: null }],
  find: async (id: number) => ({ id, category_name: "Test Category", surcharge: null }),
  create: async (category: Category) => ({ ...category, id: 1, surcharge: null }),
  update: async (id: number, category: Category) => ({ ...category, id }),
  delete: async () => {}
};

Deno.test("CategoryController Tests", async (t) => {
  const controller = new CategoryController();
  
  // Setup mocks
  categoryRepositoryObj.findAll = mockCategoryRepository.findAll;
  categoryRepositoryObj.find = mockCategoryRepository.find;
  categoryRepositoryObj.create = mockCategoryRepository.create;
  categoryRepositoryObj.update = mockCategoryRepository.update;
  categoryRepositoryObj.delete = mockCategoryRepository.delete;

  await t.step("getAll - should return all categories", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx);
    
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, [{ id: 1, category_name: "Test Category", surcharge: null }]);
  });

  await t.step("getOne - should return one category", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };

    await controller.getOne(ctx);
    
    assertEquals(ctx.response.status, 200);
    assertEquals(ctx.response.body, { id: 1, category_name: "Test Category", surcharge: null });
  });

  await t.step("getOne - should return 400 for missing id", async () => {
    const ctx = createMockContext();
    await controller.getOne(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter is required" });
  });

  await t.step("create - should create category successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      category_name: "New Category"
    });

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 201);
    assertEquals((ctx.response.body as { category_name: string }).category_name, "New Category");
  });

  await t.step("create - should return 400 for missing name", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({});

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Name is required" });
  });

  await t.step("update - should update category successfully", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    ctx.request.body.json = async () => ({
      id: 1,
      category_name: "Updated Category"
    });

    await controller.update(ctx);
    
    assertEquals(ctx.response.status, 200);
    assertEquals((ctx.response.body as { category_name: string }).category_name, "Updated Category");
  });

  await t.step("delete - should delete category successfully", async () => {
    const ctx = createMockContext();
    ctx.params = { id: "1" };
    await controller.delete(ctx as unknown as RouterContext<"/categories/:id">);
    
    assertEquals(ctx.response.status, 204);
  });

  await t.step("bulkCreate - should create multiple categories", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ([
      { category_name: "Category 1" },
      { category_name: "Category 2" }
    ]);

    await controller.bulkCreate(ctx as RouterContext<"/categories/bulk">);
    
    assertEquals(ctx.response.status, 201);
    assertEquals(Array.isArray(ctx.response.body), true);
  });

  await t.step("bulkUpdate - should update multiple categories", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ([
      { id: 1, category_name: "Updated Category 1" },
      { id: 2, category_name: "Updated Category 2" }
    ]);

    await controller.bulkUpdate(ctx as RouterContext<"/categories/bulk">);
    
    assertEquals(Array.isArray(ctx.response.body), true);
  });

  await t.step("bulkDelete - should delete multiple categories", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ([1, 2, 3]);

    await controller.bulkDelete(ctx as RouterContext<"/categories/bulk">);
    
    assertEquals(ctx.response.status, 204);
  });
});
