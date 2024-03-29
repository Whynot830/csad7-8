const { Router } = require('express')
const { body } = require('express-validator')
const userController = require('../controllers/auth')
const authMiddleware = require('../middleware/auth')

const router = new Router()

router.post('/register',
    body('email', 'Incorrect email format').isEmail(),
    body('username', 'Username should not be empty').notEmpty(),
    body('password', 'The password length should be between 3 and 32 characters long').isLength({ min: 3, max: 32 }),
    userController.register
)
router.get('/activate/:link', userController.activate)
router.post('/login', userController.login)
router.post('/refresh', userController.refresh)
router.get('/info', authMiddleware, userController.getInfo)
router.post('/logout', userController.logout)

module.exports = router