const { Router } = require('express')
const productController = require('../controllers/product')
const authMiddleware = require('../middleware/auth')

const router = Router()

router.post('/', authMiddleware, productController.create)
router.get('/', productController.readAll)
router.get('/:id', productController.read)
router.put('/:id', authMiddleware, productController.update)
router.delete('/:id', authMiddleware, productController.delete)

module.exports = router
