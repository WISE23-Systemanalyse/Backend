import { db } from "../db.ts";
import { friendships, Friendship } from "../models/friendships.ts";
import { eq, and, or } from "drizzle-orm";
import { BaseRepository } from "./baseRepository.ts";

export class FriendshipRepository extends BaseRepository<Friendship> {
    constructor() {
        super(friendships);
    }
    // Zusätzliche hilfreiche Methoden für Freundschaften
    async findByUsers(user1Id: number, user2Id: number): Promise<Friendship | null> {
        const result = await db.query.friendships.findFirst({
            where: and(
                eq(friendships.user1Id, user1Id.toString()),
                eq(friendships.user2Id, user2Id.toString())
            ),
        });
        return result || null;
    }

    async findFriendshipsByUserId(userId: string): Promise<Friendship[]> {
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
