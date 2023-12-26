let jws = require('jws')

module.exports = () => {
    return (req, res, next) => {
        /*let [scheme, signature] = req.get('Authorization').split(' ')
        if (scheme === 'Token' || scheme === 'Bearer') {
            req.authorized = jws.verify(signature,
                process.env.JWS_ALGORITHM, process.env.JWS_SECRET)
        } else {
            req.authorized = false
        }*/
        next()
    }
}