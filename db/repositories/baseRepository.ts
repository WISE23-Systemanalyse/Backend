import { eq } from "drizzle-orm";
import { Repository, Create, Id } from "../../interfaces/repository.ts";
import { db } from "../db.ts";

export class BaseRepository<TEntity extends Create<TEntity>> implements Repository<TEntity> {
  constructor(private table: any) {}

  async findAll(): Promise<TEntity[]> {
    return (await db.select().from(this.table)) as TEntity[];
  }

  async find(id: Id<TEntity>): Promise<TEntity | null> {
    const result = (await db.select().from(this.table).where(eq(this.table.id, id))) as TEntity[];
    return result.length > 0 ? result[0] : null;
  }

  async create(value: Create<TEntity>): Promise<TEntity> {
    const result = (await db.insert(this.table).values(value).returning()) as TEntity[];
    return result[0];
  }

  async update(id: Id<TEntity>, value: Create<TEntity>): Promise<TEntity> {
    const result = (await db.update(this.table).set(value).where(eq(this.table.id, id)).returning()) as TEntity[];
    return result[0];
  }

  async delete(id: Id<TEntity>): Promise<void> {
    await db.delete(this.table).where(eq(this.table.id, id));
  }
}
