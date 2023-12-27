//ini format untuk memanggil depedency yang mau digunakan
const express = require('express')
const Joi = require('joi')
const mysql = require('mysql')


const app = express()

// mengaktifkan format data jsonnya dengan extended
app.use(express.urlencoded({extended:false}))
// aktifkan jsonnya
app.use(express.json())

const connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password	: '',
	database	: 'employees',
})

connection.connect((err)=>{
	if (err) throw err
})

	// ***** untuk mengambil semua Data didalam Database *****
	app.get('/api/employees', (req, res)=>{
		connection.query('SELECT * FROM employees', (e, r)=>{
			if (e) {
				return res.status(500).send({
					status: false,
					message: 'Internal Server Error!!!'
				})
			}
			res.status(200).send({
				status: true,
				data: r,
			})
		})
	})

	// ***** untuk mengambil parameter tertentu dengan nip *****
	app.get('/api/employees/:nip', (req, res)=>{
		const employeeNip = req.params.nip

		connection.query("SELECT * FROM employees WHERE nip='"+employeeNip+"'", (e, r)=>{
			if (e) {

				return res.status(500).send({
					status: false,
					message: 'Internal Server Error !!!',
				})	
			}
			// Jika data tidak ditemukan
			if (r.length == 0) {
				return res.status(404).send({
					status: false,
					message: 'NIP Employee not found, Please Check NIP Again'
				})
			}

			res.status(200).send({
				status: true,
				data: r,
			})
		})

	})


	// ***** Untuk Post data / Kirim data *****
	app.post('/api/employees', (req, res ) =>{
		//validasi dengan joi
		const schema = Joi.object({
			nip: Joi.string().min(9).max(10).required(),
			nama: Joi.string().required(),
			alamat: Joi.string().required(),
			hp: Joi.number().required(),
			jk: Joi.boolean().required()
		})

		const {error} = schema.validate({
			nip: req.body.nip,
			nama: req.body.nama,
			alamat: req.body.alamat,
			hp: req.body.hp,
			jk: req.body.jk
		})

		if (error) {
			return res
					.status(400)
					.send({status:false, message: error.details[0].message})
		}

		// save data
		const tnip = req.body.nip
		const tnama = req.body.nama
		const talamat = req.body.alamat
		const thp = req.body.hp
		const tjk = req.body.jk?1:0
	
		connection.query("SELECT * FROM employees WHERE nip='"+tnip+"'", (e, r)=>{
			if (e) {

				return res.status(500).send({
					status: false,
					message: 'Internal Server Error !!!',
				})	
			}
			// Jika data tidak ditemukan
			if (r.length > 0) {
				return res.status(400).send({
					status: false,
					message: 'Data Nip Sudah Ada!!!'
				})
			}else{
				connection.query("INSERT INTO employees VALUES('"+tnip+"', '"+tnama+"', '"+talamat+"', '"+thp+"', '"+tjk+"')", (e, r)=>{
			
					if (e) {
						return res.status(500).send({
							status: false,
							message: 'Internal Server Error!!!'
						})
					}
					res.status(200).send({
						status: true,
						message: 'Insert data Sucessfully',
						data: {
							nip: tnip,
							nama: tnama,
							alamat: talamat,
							hp: thp,
							jk: tjk,
						},
					})
				})
			}
		})
	})



	// ***** Update Data dengan Validasi menggunakan JOI *****
	// app.put('/api/employees/:nip', (req, res)=>{
	// 	//searching by id 
	// 	const anip = req.params.nip;
		
	// 	connection.query("SELECT * FROM employees WHERE nip='"+anip+"'", (e, r)=>{
	// 		if (r.length > 0) {
	// 			// If data found
	// 			const schema = Joi.object({
	// 				nama: Joi.string().required(),
	// 				alamat: Joi.string().required(),
	// 				hp: Joi.number().required(),
	// 				jk: Joi.boolean().required()
	// 			})

	// 			// untuk validasi
	// 			const {error} = schema.validate({	
	// 				nama: req.body.nama,
	// 				alamat: req.body.alamat,
	// 				hp: req.body.hp,
	// 				jk: req.body.jk
	// 			})

				
	// 			// Jika validasi bermasalah
	// 			if (error) {
	// 				return res
	// 						.status(400)
	// 						.send({status:false, message: error.details[0].message})
	// 			}
	// 			aNama = req.body.nama
	// 			aAlamat = req.body.alamat
	// 			aHp = req.body.hp
	// 			aJk = req.body.jk

	// 			connection.query(
	// 				"UPDATE employees SET nama='"+aNama+"', alamat='"+aAlamat+"', hp='"+aHp+"', jk='"+aJk+"' WHERE nip='"+anip+"'",
	// 				(e, r)=>{
	// 					if (e) {
	// 						return res.status(500).send(
	// 							{
	// 								status:false,
	// 								message: 'Internal Server Error',
	// 							}
	// 						)
	// 					}

	// 					res.status(200).send(
	// 						{
	// 							status:true,
	// 							message: 'Update Employee Successfully',
	// 						}
	// 					)
	// 				})
	// 		}else{

	// 			// If data not found
	// 			res.status(404).send(
	// 				{
	// 					status: false,
	// 					message: 'Employee Nip not found.'
	// 				}
	// 			)
	// 		}
	// 	})


	// 	//result => found -> update data
	

	// 	res.send({status:true, message: 'Employee Update Succesfully.'})
	// })






	app.put("/api/employees/:nip", (req, res) => {

		const anip = req.params.nip
	  
		connection.query("Select * From Employees Where nip='"+anip+"'",(e, r)=>{
		  if (r.length > 0){
			const schema = Joi.object({
			  nama: Joi.string().required(),
			  alamat: Joi.string().required(),
			  hp: Joi.number().required(),
			  jk: Joi.boolean().required()
		  })
	  
			const { error } = schema.validate({
			  nama: req.body.nama,
			  alamat: req.body.alamat,
			  hp: req.body.hp,
			  jk: req.body.jk
			 });
	  
			 if(error) {
			  return res
				.status(400)
				.send({ststus:false, message: error.details[0].message})
			 }
	  
			 anama = req.body.nama
			 aalamat = req.body.alamat
			 aHp = req.body.hp
			 ajk = req.body.jk?1:0
	  
			 connection.query("UPDATE employees Set nama='"+anama+"', alamat='"+aalamat+"', hp='"+aHp+"', jk='"+ajk+"' WHERE nip='"+anip+"'",
			 (e, r)=>{

				if(e){
					
					return res.status(500).send({status: false, message: e})
				}
	  
				res.status(200).send({status: true, message: 'Updated Employee Successfully.'})
			 })
	  
	  
		  }else(
			res.status(404).send({ststus: false, message: 'Employee Nip Not Found'})
		  )
		})
		
	  });

	// Untuk Menghapus Data
	app.delete('/api/employees/:nip', (req, res) => {
		// Menemukan karyawan berdasarkan NIP
		const aNip = req.params.nip

		connection.query("DELETE FROM employees WHERE nip ='"+aNip+"'" ,(e,r)=>{

			if (e) {
				return res.status(500).send(
					{
						status: false,
						message: 'Internal Server Error',
					}
				)
			}

			res.status(200).send(
				{
					status:true,
					message: 'Delete Employee Succesfull',
				}
			)
		})
	});


	// app.delete('/api/employees/:nip', (req, res) => {
	// 	// Menemukan karyawan berdasarkan NIP
	// 	const employeeNip = req.params.nip;
	// 	const index = employees.findIndex(e => e.nip === employeeNip);

	// 	// Jika karyawan tidak ditemukan
	// 	if (index === -1) {
	// 		return res.status(404).send({
	// 			status: false,
	// 			message: 'Employee NIP Not Found.'
	// 		});
	// 	}

	// 	// Menghapus karyawan dari array

	// 	// splice ini untuk menghapus atau menambah data
	// 	employees.splice(index, 1);
		
	// 	res.send({
	// 		status: true,
	// 		message: 'Employee Deleted Successfully.',
	// 		data: employees
	// 	});
	// });




// port = process.env.port || 8080
// app.listen(port, ()=> console.log(port))

app.listen(3000, ()=> console.log('web service running on port 3000...'))
