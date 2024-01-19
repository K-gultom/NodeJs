const express = require('express')
const bcrypt = require('bcryptjs')
const Connection = require('./database')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.post('/register', (req, res)=>{

    const nama = req.body.nama
    const email = req.body.email
    const password = req.body.password

    bcrypt.hash(password, 12)
    .then(hashedPassword =>{
        Connection.query("INSERT INTO users(nama, email, password) VALUES('"+nama+"', '"+email+"', '"+hashedPassword+"')",
            (err, result)=>{
                if (err) {
                    return res.status(500).send({
                        status: false,
                        error: err,
                    })	
                }else{
                    res.status(201).send({
                        status:true,
                        message: 'User Registered Successfully'
                    })
                }
            }
        )
    })
    .catch(err=>{
        return res.status(500).send({
            status: false,
            error: err,
        })	
    })

})

router.post('/login', (req, res)=>{
    const email =  req.body.email
    const password = req.body.password

    Connection.query("SELECT * FROM users WHERE email='"+email+"'", 
        (err, result) =>{
            if (err) {
                res.status(500).send({
                    status:false,
                    error: err
                })
            } else {
                const user = result[0]
                
                // (user.password dari data base), (password dari inputan)
                bcrypt.compare(password, user.password)
                .then(
                    result1=>{
                        if (result1) {
                            const token = jwt.sign(
                                {email: req.body.email},
                                'secret',
                                {expiresIn: '1h'}
                            )
                            res.status(200).send({
                                status:true,
                                data: {
                                    email: req.body.email,
                                    token: token
                                }
                            })
                        } else{
                            res.status(400).send({
                                status: false, 
                                message: 'Password Invalid'
                            })
                        }
                        
                    }
                )
                .catch( 
                    err1=>{
                        res.status(500).send({status: false, error: err1})
                    }
                )
            }
        }
    )
})

module.exports = router