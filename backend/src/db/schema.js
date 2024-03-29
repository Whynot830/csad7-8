// import { pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
const { pgTable, serial, text, varchar, timestamp, pgEnum, boolean, integer } = require("drizzle-orm/pg-core")

const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    userId: integer('user_id').notNull().references(() => users.id)
})

const roleEnum = pgEnum('role', ['user', 'admin'])

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).unique().notNull(),
    email: varchar('email').unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    isActivated: boolean('is_activated').default(false),
    activationLink: varchar('activation_link', { length: 255 }).notNull(),
    role: roleEnum('role').default('user')
})

module.exports = { products, users, roleEnum }