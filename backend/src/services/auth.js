const uuid = require('uuid')
const bcrypt = require('bcrypt')
const { eq } = require('drizzle-orm')
const { db } = require('../db/db')
const { users } = require('../db/schema')
const UserDTO = require('../dto/user')
const tokenService = require('./token')
const mailService = require('./mail')
const ApiError = require('../exceptions/api')

class AuthService {
    async register(username, email, password) {
        let existingUser = await db.select().from(users).where(eq(users.email, email))

        if (existingUser.length !== 0)
            throw ApiError.BadRequest('Email/username already taken')

        existingUser = existingUser = await db.select().from(users).where(eq(users.username, username))
        if (existingUser.length !== 0)
            throw ApiError.BadRequest('Email/username already taken')

        const activationLink = uuid.v4()
        const encPassword = await bcrypt.hash(password, 3)
        const user = await db.insert(users).values({
            username,
            email,
            password: encPassword,
            activationLink
        }).returning()
        console.log(user);
        await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`)
        const userDto = new UserDTO(user[0])
        const tokens = tokenService.generateTokens({ ...userDto })

        return { ...tokens }
    }
    async activate(activationLink) {
        const user = await db.select().from(users).where(eq(users.activationLink, activationLink))
        if (user.length == 0)
            throw ApiError.BadRequest('Invalid activation link')
        await db.update(users).set({ isActivated: true }).where(eq(users.activationLink, activationLink))
    }
    async login(email, password) {
        const user = await db.select().from(users).where(eq(users.email, email))
        if (user.length == 0)
            throw ApiError.UnauthorizedError('Bad credentials')

        const isEqual = await bcrypt.compare(password, user[0].password)

        if (!isEqual)
            throw ApiError.UnauthorizedError('Bad credentials')

        const userDto = new UserDTO(user[0])
        const tokens = tokenService.generateTokens({ ...userDto })

        return { ...tokens }
    }
    async getInfo(id) {
        const user = await db.select().from(users).where(eq(users.id, id))
        if (user.length == 0)
            throw ApiError.BadRequest()
        return new UserDTO(user[0])
    }
    async refresh(refreshToken) {
        if (!refreshToken)
            throw ApiError.UnauthorizedError()

        const userData = tokenService.validateRefreshToken(refreshToken)
        if (!userData)
            throw ApiError.UnauthorizedError()

        const user = await db.select().from(users).where(eq(users.id, userData.id))
        const userDto = new UserDTO(user[0])
        const tokens = tokenService.generateTokens({ ...userDto })

        return { ...tokens }
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }
}
module.exports = new AuthService()