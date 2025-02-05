import { db } from "../db.ts";
import { Create, Repository } from "../../interfaces/repository.ts";
import { friendships, Friendship } from "../models/friendships.ts";
import { eq, and, or } from "drizzle-orm";

export class FriendshipRepository implements Repository<Friendship> {
    async findAll(): Promise<Friendship[]> {
        return await db.select().from(friendships);
    }

    async find(id: Friendship['id']): Promise<Friendship | null> {
        const result = await db.query.friendships.findFirst({
            where: eq(friendships.id, id),
        });
        return result || null;
    }

    async delete(id: Friendship['id']): Promise<void> {
        await db.delete(friendships).where(eq(friendships.id, id));
    }

    async create(value: Create<Friendship>): Promise<Friendship> {
        try {
            const [friendship] = await db.insert(friendships)
                .values(value)
                .returning();
            return friendship;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Friendship['id'], value: Partial<Friendship>): Promise<Friendship> {
        const [updatedFriendship] = await db.update(friendships)
            .set(value)
            .where(eq(friendships.id, id))
            .returning();
        return updatedFriendship;
    }

    // Zusätzliche hilfreiche Methoden für Freundschaften
    async findByUsers(user1Id: number, user2Id: number): Promise<Friendship | null> {
        const result = await db.query.friendships.findFirst({
            where: and(
                eq(friendships.user1Id, user1Id),
                eq(friendships.user2Id, user2Id)
            ),
        });
        return result || null;
    }

    async findFriendshipsByUserId(userId: number): Promise<Friendship[]> {
        return await db.select()
            .from(friendships)
            .where(
                or(
                    eq(friendships.user1Id, userId),
                    eq(friendships.user2Id, userId)
                )
            );
    }
}

export const friendshipRepositoryObj = new FriendshipRepository();
