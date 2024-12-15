import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { halls, Hall } from "../models/halls.ts";
import { eq } from "drizzle-orm";

export class HallRepository implements Repository<Hall> {
    async findAll(): Promise<Hall[]> {
        const allHalls = await db.select().from(halls);
        return allHalls;
    }
    async find(id: Hall['id']): Promise< Hall | null> {
        const result = await db.query.halls.findFirst({
            where: eq(halls.id, id),
          });
          return result ?? null;
    }
    async delete(id: Hall['id']): Promise<void> {
        await db.delete(halls).where(eq(halls.id, id));
    }
    async create(value: Create<Hall>): Promise<Hall> {
      const [hall] = await db.insert(halls).values(value).returning();
      return hall;
    }
    async update(id: Hall['id'], value: Create<Hall>): Promise<Hall> {
        const [updatedHall] = await db.update(halls).set(value).where(eq(halls.id, id)).returning();
        return updatedHall;
    }
}

export const hallRepository = new HallRepository();