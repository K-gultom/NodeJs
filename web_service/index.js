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
		const tjk = req.body.jk ?1:0
	
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

	// app.post('/api/employees', (req, res) => {
	// 	// Validation with Joi
	// 	const schema = Joi.object({
	// 		nip: Joi.string().min(9).max(10).required(),
	// 		nama: Joi.string().required(),
	// 		alamat: Joi.string().required(),
	// 		hp: Joi.number().required(),
	// 		jk: Joi.boolean().required()
	// 	})
	
	// 	const { error } = schema.validate({
	// 		nip: req.body.nip,
	// 		nama: req.body.nama,
	// 		alamat: req.body.alamat,
	// 		hp: req.body.hp,
	// 		jk: req.body.jk
	// 	})
	
	// 	if (error) {
	// 		return res
	// 			.status(400)
	// 			.send({ status: false, message: error.details[0].message })
	// 	}
	
	// 	// Check if data with the given NIP already exists
	// 	const existingNIP = req.body.nip;
	// 	connection.query("SELECT * FROM employees WHERE nip = ?", [existingNIP], (selectError, selectResults) => {
	// 		if (selectError) {
	// 			return res.status(500).send({
	// 				status: false,
	// 				message: 'Internal Server Error!!!'
	// 			});
	// 		}
	
	// 		if (selectResults.length > 0) {
	// 			// Data with the given NIP already exists
	// 			return res.status(400).send({
	// 				status: false,
	// 				message: 'NIP already exists in the employees table.'
	// 			});
	// 		}
	
	// 		// If the NIP is unique, proceed with the insertion
	// 		const tnip = req.body.nip;
	// 		const tnama = req.body.nama;
	// 		const talamat = req.body.alamat;
	// 		const thp = req.body.hp;
	// 		const tjk = req.body.jk ? 1 : 0;
	
	// 		connection.query("INSERT INTO employees VALUES('"+tnip+"', '"+tnama+"', '"+talamat+"', '"+thp+"', '"+tjk+"')", [tnip, tnama, talamat, thp, tjk], (insertError, insertResults) => {
	// 			if (insertError) {
	// 				return res.status(500).send({
	// 					status: false,
	// 					message: 'Internal Server Error!!!'
	// 				});
	// 			}
	
	// 			res.status(200).send({
	// 				status: true,
	// 				message: 'Insert data successfully',
	// 				data: {
	// 					nip: tnip,
	// 					nama: tnama,
	// 					alamat: talamat,
	// 					hp: thp,
	// 					jk: tjk,
	// 				},
	// 			});
	// 		});
	// 	});
	// });
	


	// ***** Update Data dengan Validasi menggunakan JOI *****
	app.put('/api/employees/:nip', (req, res)=>{
		//searching by id 
		const employeeNip = req.params.nip;
		const employee = employees.find(e=> e.nip === employeeNip)

		//result => not found
		if(!employee){
			return res
				.status(404)
				.send({status:false, message: 'Employee NIP Not Found.'})
		}

		// SchemaUpdate untuk validasi
		const schemaUpdate = Joi.object({
			nama: Joi.string().required(),
			alamat: Joi.string().required(),
			hp: Joi.number().required(),
			jk: Joi.boolean().required()
		})

		const {error} = schemaUpdate.validate({	
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

		//result => found -> update data
		employee.nama = req.body.nama
		employee.alamat = req.body.alamat
		employee.hp = req.body.hp
		employee.jk = req.body.jk

		res.send({status:true, message: 'Employee Update Succesfully.'})
	})

	// Untuk Menghapus Data
	app.delete('/api/employees/:nip', (req, res) => {
		// Menemukan karyawan berdasarkan NIP
		const employeeNip = req.params.nip;
		const index = employees.findIndex(e => e.nip === employeeNip);

		// Jika karyawan tidak ditemukan
		if (index === -1) {
			return res.status(404).send({
				status: false,
				message: 'Employee NIP Not Found.'
			});
		}

		// Menghapus karyawan dari array

		// splice ini untuk menghapus atau menambah data
		employees.splice(index, 1);
		
		res.send({
			status: true,
			message: 'Employee Deleted Successfully.',
			data: employees
		});
	});


// port = process.env.port || 8080
// app.listen(port, ()=> console.log(port))

app.listen(3000, ()=> console.log('web service running on port 3000...'))
