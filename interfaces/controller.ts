import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
export type Entity = Record<string, unknown>;
export type Id<TEntity extends Entity> = TEntity extends { id: infer TId } ? TId : unknown;

export interface Controller<T> {
  getAll(ctx: Context): Promise<void>;
  getOne(ctx: Context): Promise<void>;
  create(ctx: Context): Promise<void>;
  update(ctx: Context): Promise<void>;
  delete(ctx: Context): Promise<void>;
}
