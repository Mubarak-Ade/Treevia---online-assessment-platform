import { count, eq } from 'drizzle-orm';
import { db } from '../../shared/db/index.js';
import { NewUser, User, users } from '../../shared/db/schema/users.js';
import { IAuthRepository, UpdateUserDTO } from './types.js';

export class AuthRepository implements IAuthRepository {
    /**
     * Creates a new user record in the database.
     */
    async create(data: NewUser): Promise<User> {
        const [user] = await db
            .insert(users)
            .values({
                id: data.id,
                name: data.name,
                email:
                    typeof data.email === 'string' ? data.email.toLowerCase().trim() : data.email,
                passwordHash: data.passwordHash,
                role: data.role ?? 'educator',
            })
            .returning();
        return user;
    }

    /**
     * Finds a user by their unique primary key ID.
     */
    async findById(id: string): Promise<User | null> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user ?? null;
    }

    /**
     * Finds a user by their email address (case-insensitive & trimmed).
     */
    async findByEmail(email: string): Promise<User | null> {
        const normalizedEmail = email.toLowerCase().trim();
        const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));
        return user ?? null;
    }

    /**
     * Alias for findByEmail for backward compatibility.
     */
    async findUserByEmail(email: string): Promise<User | null> {
        return this.findByEmail(email);
    }

    /**
     * Checks if a user exists with the given email address.
     */
    async existsByEmail(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return Boolean(user);
    }

    /**
     * Updates user details by user ID.
     */
    async update(id: string, data: UpdateUserDTO): Promise<User | null> {
        const updatePayload: Partial<NewUser> = {
            ...data,
            ...(data.email ? { email: data.email.toLowerCase().trim() } : {}),
            updatedAt: new Date(),
        };

        const [updatedUser] = await db
            .update(users)
            .set(updatePayload)
            .where(eq(users.id, id))
            .returning();

        return updatedUser ?? null;
    }

    /**
     * Updates a user's password hash and updates the timestamp.
     */
    async updatePassword(id: string, passwordHash: string): Promise<User | null> {
        const [updatedUser] = await db
            .update(users)
            .set({
                passwordHash,
                updatedAt: new Date(),
            })
            .where(eq(users.id, id))
            .returning();

        return updatedUser ?? null;
    }

    /**
     * Deletes a user by their primary key ID.
     * Returns true if a record was deleted, false otherwise.
     */
    async delete(id: string): Promise<boolean> {
        const [deleted] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning({ id: users.id });

        return Boolean(deleted);
    }

    /**
     * Returns the total count of registered users.
     */
    async count(): Promise<number> {
        const [result] = await db.select({ total: count() }).from(users);
        return Number(result?.total ?? 0);
    }
}
