const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const bcrypt = require('bcrypt')
const { users } = require('./schema');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

const db = drizzle(pool)

db.insert(users).values({
    username: 'admin',
    email: 'aminfury@mail.ru',
    password: bcrypt.hashSync('admin', 3),
    activationLink: 'link',
    isActivated: true,
    role: 'admin'
}).catch(() => { })

module.exports = { db, pool }