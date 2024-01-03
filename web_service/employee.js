//ini format untuk memanggil depedency yang mau digunakan
const express = require('express')
const Connection = require('./database')
const Joi = require('joi')


const router = express.Router()

	// ***** untuk mengambil semua Data didalam Database *****
	router.get('/', (req, res)=>{
		Connection.query('SELECT * FROM employees', (e, r)=>{
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
	router.get('/:nip', (req, res)=>{
		const employeeNip = req.params.nip

		Connection.query("SELECT * FROM employees WHERE nip='"+employeeNip+"'", (e, r)=>{
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
	router.post('/', (req, res ) =>{
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
	
		Connection.query("SELECT * FROM employees WHERE nip='"+tnip+"'", (e, r)=>{
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
				Connection.query("INSERT INTO employees VALUES('"+tnip+"', '"+tnama+"', '"+talamat+"', '"+thp+"', '"+tjk+"')", (e, r)=>{
			
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


	router.put("/:nip", (req, res) => {

		const anip = req.params.nip
	  
		Connection.query("Select * From Employees Where nip='"+anip+"'",(e, r)=>{
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
	  
			 Connection.query("UPDATE employees Set nama='"+anama+"', alamat='"+aalamat+"', hp='"+aHp+"', jk='"+ajk+"' WHERE nip='"+anip+"'",
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
	router.delete('/:nip', (req, res) => {
		// Menemukan karyawan berdasarkan NIP
		const aNip = req.params.nip

		Connection.query("DELETE FROM employees WHERE nip ='"+aNip+"'" ,(e,r)=>{

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
 
    module.exports = router
