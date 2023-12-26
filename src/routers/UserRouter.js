const router = require('express').Router()
const crypto = require('node:crypto')
const UserValidationRouter = require('./UserValidationRouter')
const passutil = require('../password')

module.exports = (db) => {
    router.use('/', UserValidationRouter())

    router.post('/', (req, res, next) => {
        let userId = crypto.randomUUID()
        passutil.hashPassword(req.body.password).then(([hash, salt]) => {
            let user = new User(
                userId, req.body.email, hash, salt, passutil.passwordHashDetails())
            insertUser(user, db).then(() => {
                res.json({userId})
            }).catch((err) => {
                next(err)
            })
        })
    })

    router.post('/login', (req, res, next) => {
        console.log(req.body.email, req.body.password)
        res.end()
    })

    return router
}