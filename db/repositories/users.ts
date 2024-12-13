import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { users, User } from "../models/users.ts";
import { eq } from "drizzle-orm";


export class UserRepository implements Repository<User> {
    async findAll(): Promise<User[]> {
        const allUsers = await db.select().from(users);
        return allUsers;
    }
    async find(id: User['id']): Promise< User | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.id, id),
          });
          return result ?? null;
    }
    async delete(id: User['id']): Promise<void> {
        await db.delete(users).where(eq(users.id, id));
    }
    async create(value: Create<User>): Promise<User> {
      const [user] = await db.insert(users).values(value).returning();
      return user;
    }
    async update(id: User['id'], value: Create<User>): Promise<User> {
        const [updatedUser] = await db.update(users).set(value).where(eq(users.id, id)).returning();
        return updatedUser;
    }
} 

export const userRepository = new UserRepository();
