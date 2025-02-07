import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { friendshipRepositoryObj } from "../../../db/repositories/friendships.ts";
import { db } from "../../../db/db.ts";

// Mock für die Datenbank-Queries
const mockFriendship = {
  id: 1,
  user1Id: "user1",
  user2Id: "user2",
  status: "PENDING",
  created_at: new Date(),
  updated_at: new Date()
};

// Mock DB Instanz
const mockDb = {
  select: () => ({
    from: function(table: any) {
      return {
        where: () => [mockFriendship],
        ...([mockFriendship])
      };
    }
  }),
  insert: () => ({
    values: () => ({
      returning: () => [{ ...mockFriendship, id: 2 }]
    })
  }),
  query: {
    select: () => ({
      from: () => ({
        where: () => [mockFriendship]
      })
    })
  }
};

Deno.test("Friendships Repository Tests", async (t) => {
  await t.step("setup", () => {
    // @ts-ignore - Mock db
    db.select = mockDb.select;
    // @ts-ignore - Mock db
    db.insert = mockDb.insert;
    // @ts-ignore - Mock db
    db.query = mockDb.query;
  });

  await t.step("sollte eine Freundschaft nach ID finden", async () => {
    const friendship = await friendshipRepositoryObj.find(1);
    console.log("friendship", friendship);
    console.log("friendship.id", friendship?.id);
    console.log("friendship.user1Id", friendship?.user1Id);
    console.log("friendship.user2Id", friendship?.user2Id);
    assertEquals(friendship?.id, 1);
    assertEquals(friendship?.user1Id, "user1");
    assertEquals(friendship?.user2Id, "user2");
  });

  await t.step("sollte alle Freundschaften finden", async () => {
    const friendships = await friendshipRepositoryObj.findAll();
    assertEquals(friendships[0].id, 1);
  });

  await t.step("sollte Freundschaften nach UserId finden", async () => {
    const friendships = await friendshipRepositoryObj.findFriendshipsByUserId("user1");
    assertEquals(friendships.length, 1);
    assertEquals(friendships[0].user1Id, "user1");
  });

  await t.step("sollte eine neue Freundschaft erstellen", async () => {
    const newFriendship = {
      user1Id: "user3",
      user2Id: "user4"
    };

    const result = await friendshipRepositoryObj.create(newFriendship);
    assertEquals(result.id, 2);
    assertEquals(result.user1Id, "user1");
    assertEquals(result.user2Id, "user2");
  });
});
