import { db } from "../db.ts";
import { Repository } from "../../interfaces/repository.ts";
import { categories, Category } from "../models/categories.ts";
import { eq } from "drizzle-orm";
import { BaseRepository } from "./baseRepository.ts";

export class CategoryRepository extends BaseRepository<Category> {
    constructor() {
        super(categories);
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