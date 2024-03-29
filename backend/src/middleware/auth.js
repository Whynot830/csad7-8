const ApiError = require("../exceptions/api")
const tokenService = require('../services/token')
module.exports = function (req, res, next) {
    try {
        const accessToken = req.cookies.accessToken
        // const refreshToken = req.cookies.refreshToken

        if (!accessToken)
            return next(ApiError.UnauthorizedError())

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) return next(ApiError.UnauthorizedError())

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}