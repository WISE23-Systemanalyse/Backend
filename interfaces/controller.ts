import { RouterContext } from "https://deno.land/x/oak@v17.1.4/mod.ts";
export type Entity = Record<string, unknown>;
export type Id<TEntity extends Entity> = TEntity extends { id: infer TId } ? TId : unknown;

export interface Controller<T> {
  getAll(ctx: RouterContext<string>): Promise<void>;
  getOne(ctx: RouterContext<string>): Promise<void>;
  create(ctx: RouterContext<string>): Promise<void>;
  update(ctx: RouterContext<string>): Promise<void>;
  delete(ctx: RouterContext<string>): Promise<void>;
}
