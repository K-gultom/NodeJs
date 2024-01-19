const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{

    const authHeader = req.get('Authorization')

    // if no token
    if(!authHeader){
        return res.status(401).send({
            status:false,
            message: 'Not Authenticated!!!'
        })
    }

    const token = authHeader.split(' ')[1]
    let decodedToken

    try {
        decodedToken = jwt.verify(token, 'secret')
    } catch (err) {
        // Kalau terjadi kesalahan di server
        return res.status(500).send({
            status: false,
            error: err
        })
    }

    // Jika token salah masuk/token expired
    if (!decodedToken) {
        return res(401).send({
            status: false,
            message: 'Not Authenticated!!!'
        })
    }
    
    req.email = decodedToken.email
    next()
}