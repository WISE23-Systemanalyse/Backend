import { Context, RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Controller } from "../interfaces/controller.ts";
import { friendshipRepositoryObj } from "../db/repositories/friendships.ts";
import { Friendship } from "../db/models/friendships.ts";
import { userRepositoryObj } from "../db/repositories/users.ts";

export class FriendshipController implements Controller<Friendship> {
  async update(ctx: RouterContext<"/friendships/:id"> ): Promise<void> {
      throw new Error("Method not implemented.");
  }
  async getAll(ctx: Context): Promise<void> {
    const friendships = await friendshipRepositoryObj.findAll();
    ctx.response.body = friendships;
  }

  async getOne(ctx: RouterContext<"/friendships/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter ist erforderlich" };
      return;
    }
    const friendship = await friendshipRepositoryObj.find(id);
    if (friendship) {
      ctx.response.body = friendship;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Freundschaft nicht gefunden" };
    }
  }

  async getFriendshipsByUserId(ctx: RouterContext<"/friendships/user/:userId">): Promise<void> {
    const { userId } = ctx.params;
    if (!userId) {
      ctx.response.status = 400;
      ctx.response.body = { message: "UserId parameter ist erforderlich" };
      return;
    }

    try {
      // Prüfe ob der User existiert
      const user = await userRepositoryObj.find(userId);
      if (!user) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Benutzer nicht gefunden" };
        return;
      }

      // Hole alle Freundschaften des Users
      const friendships = await friendshipRepositoryObj.findFriendshipsByUserId(userId);
      ctx.response.body = friendships;

    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { 
        message: "Fehler beim Abrufen der Freundschaften",
        error: error.message 
      };
    }
  }

  async create(ctx: Context): Promise<void> {
    try {
      const value = await ctx.request.body;
      if (!value) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Request body ist erforderlich" };
        return;
      }
      
      let data;
      try {
        data = await value.json();
      } catch (jsonError) {
        ctx.response.status = 400;
        ctx.response.body = { 
          message: "Ungültiges JSON Format",
          error: jsonError.message 
        };
        return;
      }

      const { user1Id, user2Id } = data;

      if (!user1Id || !user2Id) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Beide Benutzer-IDs sind erforderlich" };
        return;
      }

      // Überprüfe, ob beide Benutzer existieren
      const [user1, user2] = await Promise.all([
        userRepositoryObj.find(user1Id),
        userRepositoryObj.find(user2Id)
      ]);

      if (!user1 || !user2) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Einer oder beide Benutzer wurden nicht gefunden" };
        return;
      }

      // Überprüfe Freundschaft in beide Richtungen
      const [friendship1, friendship2] = await Promise.all([
        friendshipRepositoryObj.findByUsers(user1Id, user2Id),
        friendshipRepositoryObj.findByUsers(user2Id, user1Id)
      ]);

      if (friendship1 || friendship2) {
        ctx.response.status = 409; // Conflict
        ctx.response.body = { 
          message: "Freundschaft existiert bereits",
          friendship: friendship1 || friendship2 
        };
        return;
      }

      const friendship = await friendshipRepositoryObj.create({ user1Id, user2Id });
      ctx.response.status = 201;
      ctx.response.body = friendship;

    } catch (error) {
      if (error.message.includes("duplicate")) {
        ctx.response.status = 409;
        ctx.response.body = { 
          message: "Freundschaft existiert bereits",
          error: error.message 
        };
      } else {
        ctx.response.status = 400;
        ctx.response.body = { 
          message: "Fehler beim Erstellen der Freundschaft", 
          error: error.message 
        };
      }
    }
  }

  async delete(ctx: RouterContext<"/friendships/:id">): Promise<void> {
    const { id } = ctx.params;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Id parameter ist erforderlich" };
      return;
    }
    const friendship = await friendshipRepositoryObj.find(id);
    if (friendship) {
      await friendshipRepositoryObj.delete(id);
      ctx.response.status = 204;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Freundschaft nicht gefunden" };
    }
  }

  // Zusätzliche spezifische Methoden für Freundschaften
  async getFriendships(ctx: RouterContext<"/friendships/user/:userId">): Promise<void> {
    const { userId } = ctx.params;
    if (!userId) {
      ctx.response.status = 400;
      ctx.response.body = { message: "UserId parameter ist erforderlich" };
      return;
    }
    
    const friendships = await friendshipRepositoryObj.findFriendshipsByUserId(parseInt(userId));
    ctx.response.body = friendships;
  }

  async checkFriendship(ctx: RouterContext<"/friendships/check">): Promise<void> {
    const value = await ctx.request.body().value;
    const { user1Id, user2Id } = value;
    
    if (!user1Id || !user2Id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Beide User IDs sind erforderlich" };
      return;
    }

    const friendship = await friendshipRepositoryObj.findByUsers(user1Id, user2Id);
    if (friendship) {
      ctx.response.body = { exists: true, friendship };
    } else {
      ctx.response.body = { exists: false };
    }
  }
}

export const friendshipController = new FriendshipController();
