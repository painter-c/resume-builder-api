const router = require('express').Router()
const validator = require('validator')
const PasswordRequirements = require('../common/PasswordRequirements')
const ApiErrors = require('../common/ApiErrors')

router.post('/', (req, res, next) => {
    /* validate email */
    if (!req.body.email) {
        return next(ApiErrors.MissingFieldError('email'))
    } else if (!validator.isEmail(req.body.email)) {
        return next(ApiErrors.InvalidEmailError(req.body.email))
    }
    /* validate password */
    if (!req.body.password) {
        return next(ApiErrors.MissingFieldError('password'))
    }
    let problems = PasswordRequirements.problemsWith(req.body.password)
    if (problems.length) {
        return next(ApiErrors.WeakPasswordError(problems))
    }
    next()
})

router.post('/login', (req, res, next) => {
    /* validate email */
    if (!req.body.email) {
        return next(ApiErrors.MissingFieldError('email'))
    } else if (!validator.isEmail(email)) {
        return next(ApiErrors.InvalidEmailError(req.body.email))
    }
    /* validate password */
    if (!req.body.password) {
        return next(ApiErrors.MissingFieldError('password'))
    }
    next()
})

module.exports = () => {
    return router
}