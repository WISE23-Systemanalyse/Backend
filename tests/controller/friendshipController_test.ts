import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RouterContext, Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { FriendshipController } from "../../controllers/friendshipController.ts";
import { friendshipRepositoryObj } from "../../db/repositories/friendships.ts";
import { userRepositoryObj } from "../../db/repositories/users.ts";

// Mock für Context und RouterContext
const createMockContext = () => {
  return {
    request: {
      body: {
        value: {},
        json: async () => ({})
      }
    },
    response: {
      status: 0,
      body: {}
    },
    params: {}
  } as unknown as Context;
};

// Mock für Repository Objekte
const mockFriendshipRepo = {
  findAll: async () => [],
  find: async () => null,
  findFriendshipsByUserId: async () => [],
  findByUsers: async () => null,
  create: async () => ({ id: 1, user1Id: "1", user2Id: "2" }),
  delete: async () => {}
};

const mockUserRepo = {
  find: async () => ({ id: "1", email: "test@test.com" })
};

Deno.test("FriendshipController Tests", async (t) => {
  const controller = new FriendshipController();

  // Setup mocks
  friendshipRepositoryObj.findAll = mockFriendshipRepo.findAll;
  friendshipRepositoryObj.find = mockFriendshipRepo.find;
  friendshipRepositoryObj.findFriendshipsByUserId = mockFriendshipRepo.findFriendshipsByUserId;
  friendshipRepositoryObj.findByUsers = mockFriendshipRepo.findByUsers;
  friendshipRepositoryObj.create = mockFriendshipRepo.create;
  friendshipRepositoryObj.delete = mockFriendshipRepo.delete;
  userRepositoryObj.find = mockUserRepo.find;

  await t.step("getAll - should return empty array", async () => {
    const ctx = createMockContext();
    await controller.getAll(ctx);
    assertEquals(ctx.response.body, []);
  });

  await t.step("getOne - should return 400 for missing id", async () => {
    const ctx = createMockContext() as RouterContext<"/friendships/:id">;
    await controller.getOne(ctx);
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Id parameter ist erforderlich" });
  });

  await t.step("create - should create friendship successfully", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      user1Id: "1",
      user2Id: "2"
    });

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 201);
    assertEquals(ctx.response.body, { id: 1, user1Id: "1", user2Id: "2" });
  });

  await t.step("create - should return 400 for missing user ids", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      user1Id: "1"
      // user2Id missing
    });

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Beide Benutzer-IDs sind erforderlich" });
  });

  await t.step("getFriendshipsByUserId - should return friendships", async () => {
    const ctx = createMockContext() as RouterContext<"/friendships/user/:userId">;
    ctx.params = { userId: "1" };

    await controller.getFriendshipsByUserId(ctx);
    
    assertEquals(ctx.response.body, []);
  });

  await t.step("getFriendshipsByUserId - should return 400 for missing userId", async () => {
    const ctx = createMockContext() as RouterContext<"/friendships/user/:userId">;
    
    await controller.getFriendshipsByUserId(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "UserId parameter ist erforderlich" });
  });

  await t.step("delete - should return 404 for non-existent friendship", async () => {
    const ctx = createMockContext() as RouterContext<"/friendships/:id">;
    ctx.params = { id: "999" };

    await controller.delete(ctx);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Freundschaft nicht gefunden" });
  });

  await t.step("checkFriendship - should return exists false", async () => {
    const ctx = createMockContext() as RouterContext<"/friendships/check">;
    ctx.request.body.json = async () => ({ user1Id: "1", user2Id: "2" });

    await controller.checkFriendship(ctx);
    
    assertEquals(ctx.response.body, { exists: false });
  });

  await t.step("create - sollte 400 bei fehlendem Request Body zurückgeben", async () => {
    const ctx = createMockContext();
    Object.defineProperty(ctx.request, 'body', {
      value: undefined,
      writable: true
    });

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Request body ist erforderlich" });
  });

  await t.step("create - sollte 400 bei ungültigem JSON zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => {
      throw new Error("Invalid JSON format");
    };

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { 
      message: "Ungültiges JSON Format",
      error: "Invalid JSON format"
    });
  });

  await t.step("create - sollte 404 bei nicht existierendem Benutzer zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      user1Id: "999",
      user2Id: "888"
    });

    // Mock für nicht gefundenen Benutzer
    userRepositoryObj.find = async () => null;

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Einer oder beide Benutzer wurden nicht gefunden" });
  });

  await t.step("getFriendshipsByUserId - sollte 404 bei nicht existierendem Benutzer zurückgeben", async () => {
    const ctx = createMockContext() as RouterContext<"/friendships/user/:userId">;
    ctx.params = { userId: "999" };

    // Mock für nicht gefundenen Benutzer
    userRepositoryObj.find = async () => null;

    await controller.getFriendshipsByUserId(ctx);
    
    assertEquals(ctx.response.status, 404);
    assertEquals(ctx.response.body, { message: "Benutzer nicht gefunden" });
  });

  await t.step("getFriendshipsByUserId - sollte 500 bei Datenbankfehler zurückgeben", async () => {
    const ctx = createMockContext() as RouterContext<"/friendships/user/:userId">;
    ctx.params = { userId: "1" };

    // Mock für Datenbankfehler
    userRepositoryObj.find = async () => ({ id: "1", email: "test@test.com" });
    friendshipRepositoryObj.findFriendshipsByUserId = async () => {
      throw new Error("Database connection error");
    };

    await controller.getFriendshipsByUserId(ctx);
    
    assertEquals(ctx.response.status, 500);
    assertEquals(ctx.response.body, { 
      message: "Fehler beim Abrufen der Freundschaften",
      error: "Database connection error"
    });
  });

  await t.step("checkFriendship - sollte 400 bei fehlenden User IDs zurückgeben", async () => {
    const ctx = createMockContext() as RouterContext<"/friendships/check">;
    ctx.request.body.json = async () => ({
      user1Id: "1"
      // user2Id fehlt
    });

    await controller.checkFriendship(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { message: "Beide User IDs sind erforderlich" });
  });

  await t.step("create - sollte 400 bei Datenbankfehler zurückgeben", async () => {
    const ctx = createMockContext();
    ctx.request.body.json = async () => ({
      user1Id: "1",
      user2Id: "2"
    });

    // Mocks für erfolgreiche Benutzerprüfung
    userRepositoryObj.find = async () => ({ id: "1", email: "test@test.com" });
    friendshipRepositoryObj.findByUsers = async () => null;

    // Mock für Datenbankfehler beim Erstellen
    friendshipRepositoryObj.create = async () => {
      throw new Error("Database error during creation");
    };

    await controller.create(ctx);
    
    assertEquals(ctx.response.status, 400);
    assertEquals(ctx.response.body, { 
      message: "Fehler beim Erstellen der Freundschaft",
      error: "Database error during creation"
    });
  });
});
