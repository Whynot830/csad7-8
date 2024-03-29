const { eq } = require("drizzle-orm")
const { db } = require("../db/db")
const { products, users } = require("../db/schema")
const ApiError = require("../exceptions/api")

class ProductService {
    async create(name, description, userId) {
        const product = await db.insert(products).values({ name, description, userId }).returning()
        return product[0]
    }
    async readAll() {
        const savedProducts = await db.select({
            id: products.id,
            name: products.name,
            description: products.description,
            createdAt: products.createdAt,
            user: {
                id: users.id,
                username: users.username
            }
        }).from(products).leftJoin(users, eq(users.id, products.userId)).orderBy(products.id)
        return savedProducts
    }
    async read(id) {
        const product = await db.select().from(products).where(eq(products.id, id))
        if (product.length == 0)
            throw ApiError.EntityNotFoundError()
        return product[0]
    }
    async update(id, name, description, user) {
        const product = await db.select().from(products).where(eq(products.id, id))
        if (product.length == 0)
            throw ApiError.EntityNotFoundError()

        if (product[0].userId != user.id && user.role !== 'admin')
            throw ApiError.Forbidden()

        const flag1 = typeof (name) !== 'string' && name
        const flag2 = typeof (description) !== 'string' && description

        if (flag1 || flag2)
            throw ApiError.BadRequest('Invalid types used')

        const newBody = {
            name: name ?? product[0].name,
            description: description ?? product[0].description
        }

        const updatedProduct = await db.update(products).set(newBody).where(eq(products.id, id)).returning()
        return updatedProduct
    }
    async delete(id, user) {
        const product = await db.select().from(products).where(eq(products.id, id))
        if (product.length == 0)
            throw ApiError.EntityNotFoundError()
        
        if (product[0].userId != user.id && user.role !== 'admin')
            throw ApiError.Forbidden()

        await db.delete(products).where(eq(products.id, id))
    }
}

module.exports = new ProductService()