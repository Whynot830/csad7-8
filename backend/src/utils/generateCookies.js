module.exports = (res, userData) => {
    res.cookie('accessToken', userData.accessToken, { maxAge: process.env.ACCESS_COOKIE_MAX_AGE, httpOnly: true })
    res.cookie('refreshToken', userData.refreshToken, { maxAge: process.env.REFRESH_COOKIE_MAX_AGE, httpOnly: true })
}