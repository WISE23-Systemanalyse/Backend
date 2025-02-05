import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { categories, Category } from "../models/categories.ts";
import { eq } from "drizzle-orm";

export class CategoryRepository implements Repository<Category> {
    async findAll(): Promise<Category[]> {
        const allCategories = await db.select().from(categories);
        return allCategories;
    }

    async find(id: Category['id']): Promise<Category | null> {
        const result = await db.query.categories.findFirst({
            where: eq(categories.id, id),
        });
        return result ?? null;
    }

    async create(value: Create<Category>): Promise<Category> {
        const [category] = await db.insert(categories).values(value).returning();
        return category;
    }

    async update(id: Category['id'], value: Create<Category>): Promise<Category> {
        const [updatedCategory] = await db.update(categories)
            .set({
                category_name: value.category_name,
                surcharge: value.surcharge,
            })
            .where(eq(categories.id, id))
            .returning();
        return updatedCategory;
    }

    async delete(id: Category['id']): Promise<void> {
        await db.delete(categories).where(eq(categories.id, id));
    }

    // Zusätzliche Methode um Kategorien nach Namen zu finden
    async findByName(name: string): Promise<Category | null> {
        const result = await db.query.categories.findFirst({
            where: eq(categories.category_name, name),
        });
        return result ?? null;
    }
}

export const categoryRepositoryObj = new CategoryRepository(); 