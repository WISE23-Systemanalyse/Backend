import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { users, User } from "../models/users.ts";
import { eq } from "drizzle-orm";


export class UserRepository implements Repository<User> {
    async findAll(): Promise<any[]> {
        const allUsers = await db.select().from(users);
        const usersWithoutPassword = allUsers.map(({ password, ...user }) => user);
        return usersWithoutPassword;
    }
    async find(id: User['id']): Promise< any | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.id, id),
          });
        if (!result) return null;
        const { password: _password, ...user } = result;
        return user;
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

    async findByEmail(email: User['email']): Promise<User | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.email, email),
          });
        if (!result) return null;
        return user;
    }
} 

export const userRepository = new UserRepository();
