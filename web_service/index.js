const express = require('express')
const employee = require('./employee')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/employees', employee)

app.listen(3000, ()=> console.log('Web Service running on port 3000...')) 
 