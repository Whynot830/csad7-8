const ApiError = require('../exceptions/api')
const service = require('../services/auth')
const { validationResult } = require('express-validator')
const generateCookies = require('../utils/generateCookies')

class AuthController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Validation error', errors.array()))
            const { username, email, password } = req.body
            await service.register(username, email, password)
            return res.sendStatus(200)
        } catch (err) { next(err) }
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await service.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (err) { next(err) }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await service.login(email, password)
            generateCookies(res, userData)
            return res.sendStatus(200)
        } catch (err) { next(err) }
    }
    async getInfo(req, res, next) {
        try {
            const { id } = req.user
            const userData = await service.getInfo(id)
            return res.json(userData)
        } catch (err) { next(err) }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await service.refresh(refreshToken)
            generateCookies(res, userData)
            return res.sendStatus(204)
        } catch (err) { next(err) }
    }
    async logout(req, res, next) {
        try {
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            return res.sendStatus(204)
        } catch (err) { next(err) }
    }
}

module.exports = new AuthController()