const express = require('express')
const employee = require('./employee')
const user = require('./user')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/employees', employee)
app.use('/api/users', user)



app.listen(3000, ()=> console.log('Web Service running on port 3000...')) 
 