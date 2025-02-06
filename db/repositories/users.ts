import { Create } from "../../interfaces/repository.ts";
import { users, User } from "../models/users.ts";
import { eq } from "drizzle-orm";
import { BaseRepository } from "./baseRepository.ts";

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(users);
    }
    override async findAll(): Promise<any[]> {
      const allUsers = await this.db.select().from(users) as User[];
      const usersWithoutPassword = allUsers.map(({ password, ...user }) => user);
      return usersWithoutPassword;
    }
    override async find(id: User['id']): Promise< any | null> {
        const result = await this.db.query.users.findFirst({
            where: eq(users.id, id),
          });
        if (!result) return null;
        const { password: _password, ...user } = result;
        return user;
    }

    override async create(value: Create<User>): Promise<User> {
      try {
        const [user] = await this.db.insert(users).values({
          ...value,
          id: crypto.randomUUID(),
        }).returning();
        return user;
      } catch (error) {
        throw error;
      }
    }

    async findByEmail(email: User['email']): Promise<User | null> {
        const result = await this.db.query.users.findFirst({
            where: eq(users.email, email),
          });
        if (!result) return null;
        return result;
    }
} 

export const userRepositoryObj = new UserRepository();
