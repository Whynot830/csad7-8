module.exports = class ApiError extends Error {
    status
    errors

    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }
    static UnauthorizedError(message = 'Unauthorized') {
        return new ApiError(401, message)
    }
    static Forbidden(message = 'Forbidden') {
        return new ApiError(403, message)
    }
    static EntityNotFoundError(message = 'Entity not found') {
        return new ApiError(404, message)
    }
}