const {app, setup} = require('./app')

const server = app.listen(process.env.SERVER_PORT || 4000, () => {
    console.log(`Listening on port ${server.address().port}.`)
    setup()
})