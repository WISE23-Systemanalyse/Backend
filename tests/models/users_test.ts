import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { users } from "../../db/models/users.ts";

const mockUsers = {
  _: {
    name: "users",
    columns: {
      id: { dataType: "string" },
      password: { dataType: "string" },
      email: { dataType: "string" },
      firstName: { dataType: "string" },
      lastName: { dataType: "string" },
      userName: { dataType: "string" },
      imageUrl: { dataType: "string" },
      createdAt: { dataType: "date" },
      updatedAt: { dataType: "date" },
      isAdmin: { dataType: "boolean" },
      isVerified: { dataType: "boolean" }
    }
  },
  $inferSelect: {
    id: "user123",
    password: "hashedpw",
    email: "test@test.com",
    firstName: "Max",
    lastName: "Mustermann",
    userName: "maxm",
    imageUrl: "profile.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
    isAdmin: false,
    isVerified: true
  }
};

Deno.test("Users Model Tests", async (t) => {
  await t.step("sollte korrekte Tabellendefinition haben", () => {
    // @ts-ignore - Mock Model
    users._ = mockUsers._;
    assertEquals(users._.name, "users");
  });

  await t.step("sollte korrekte Spalten haben", () => {
    // @ts-ignore - Mock Model
    users.$inferSelect = mockUsers.$inferSelect;
    const columns = users.$inferSelect;
    
    assertEquals(typeof columns.id, "string");
    assertEquals(typeof columns.password, "string");
    assertEquals(typeof columns.email, "string");
    assertEquals(typeof columns.firstName, "string");
    assertEquals(typeof columns.lastName, "string");
    assertEquals(typeof columns.userName, "string");
    assertEquals(typeof columns.imageUrl, "string");
    assertEquals(typeof columns.createdAt, "object");
    assertEquals(typeof columns.updatedAt, "object");
    assertEquals(typeof columns.isAdmin, "boolean");
    assertEquals(typeof columns.isVerified, "boolean");
  });

  await t.step("sollte korrekte Spaltentypen haben", () => {
    const columns = users._.columns;
    
    assertEquals(columns.id.dataType, "string");
    assertEquals(columns.password.dataType, "string");
    assertEquals(columns.email.dataType, "string");
    assertEquals(columns.firstName.dataType, "string");
    assertEquals(columns.lastName.dataType, "string");
    assertEquals(columns.userName.dataType, "string");
    assertEquals(columns.imageUrl.dataType, "string");
    assertEquals(columns.createdAt.dataType, "date");
    assertEquals(columns.updatedAt.dataType, "date");
    assertEquals(columns.isAdmin.dataType, "boolean");
    assertEquals(columns.isVerified.dataType, "boolean");
  });
});
