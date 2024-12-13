import { Context } from "https://deno.land/x/oak/mod.ts";

export type Entity = Record<string, unknown>;
export type Id<TEntity extends Entity> = TEntity extends { id: infer TId } ? TId : unknown;
export type Create<TEntity extends Entity> = TEntity;

export interface Controller<TEntity extends Entity> {
  getAll(ctx: Context): Promise<void>;
  getOne(ctx: Context): Promise<void>;
  create(ctx: Context): Promise<void>;
  update(ctx: Context): Promise<void>;
  delete(ctx: Context): Promise<void>;
}
