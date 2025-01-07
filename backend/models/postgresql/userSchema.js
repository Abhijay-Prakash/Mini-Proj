import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    userId: serial("user_id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at", { defaultNow: true }),
});
