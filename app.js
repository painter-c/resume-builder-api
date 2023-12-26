const express = require('express')
const Schema = require('./database/Schema')
const AuthCheck = require('./src/middleware/AuthCheck')
const UserRouter = require('./src/routers/UserRouter')
const ErrorHandlers = require('./src/middleware/ErrorHandlers')
const dbConnPool = require('./database/DbConnPool')

const app = express()

async function setup() {
    await Schema.execute()

    app.use(express.json())
    app.use(AuthCheck())
    app.use('/users', UserRouter(dbConnPool))
    app.use('/', ErrorHandlers.InternalErrorHandler)
    app.use('/', ErrorHandlers.ApiErrorHandler)
}

module.exports = {app, setup}