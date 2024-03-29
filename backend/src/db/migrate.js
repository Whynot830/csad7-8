const { db } = require('./db.js')
const { migrate } = require('drizzle-orm/node-postgres/migrator')

const main = async () => {
    console.log("Migration started")
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migration complete")
    process.exit(0)
}

main().catch((err) => {
    console.log(err)
    process.exit(0)
})