const service = require('../services/product')

class ProductController {
    async create(req, res, next) {
        try {
            const { name, description } = req.body
            const userId = req.user.id
            const product = await service.create(name, description, userId)
            return res.json(product)
        } catch (err) { next(err) }
    }
    async readAll(req, res, next) {
        try {
            const products = await service.readAll()
            return res.json(products)
        } catch (err) { next(err) }
    }
    async read(req, res, next) {
        try {
            const { id } = req.params
            const product = await service.read(id)
            return res.json(product)
        } catch (err) { next(err) }
    }
    async update(req, res, next) {
        try {
            const { params: { id }, user } = req
            const { name, description } = req.body
            const updatedProduct = await service.update(id, name, description, user)
            return res.json(updatedProduct)
        } catch (err) { next(err) }
    }
    async delete(req, res, next) {
        try {
            const { params: { id }, user } = req
            await service.delete(id, user)
            return res.status(204).json()
        } catch (err) { next(err) }
    }
}

module.exports = new ProductController()