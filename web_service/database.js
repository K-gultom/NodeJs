const mysql = require('mysql')

const Connection = mysql.createConnection({
    host	: 'localhost',
	user	: 'root',
	password	: '',
	database	: 'employees',
})

Connection.connect((err)=>{
	if (err) throw err
})

// agar bisa Connection bisa digunakan di file Lain!!!
module.exports = Connection