const express = require('express')
const airminum = require('./airminum')
const user = require('./user')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/airminum', airminum)
app.use('/api/users', user)



app.listen(3000, ()=> console.log('Web Service running on port 3000...')) 
 