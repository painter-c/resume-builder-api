const ApiErrors = require('../common/ApiErrors')

function InternalErrorHandler(error, req, res, next) {
    if (!ApiErrors.didConstruct(error)) {
        console.error(error)
        res.status(500).end()
        return
    }
    next(error)
}

function ApiErrorHandler(error, req, res, next) {
    res.status(error.statusCode).json({
        name: error.name,
        status: error.statusCode,
        message: error.message,
        details: error.details
    })
}

module.exports = { 
    InternalErrorHandler,
    ApiErrorHandler
}