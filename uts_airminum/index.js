const express = require('express')
const Joi = require('joi')
// const { createConnection } = require('mysql')
const app = express()
const mysql = require('mysql')

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const Connection = mysql.createConnection({
    host	: 'localhost',
	user	: 'root',
	password	: '',
	database	: 'db_airminum',
})

Connection.connect((err)=>{
	if (err) throw err
})


// var airminum = [{
//     id: '01',
//     category: 'Gelas/Cup',
//     produk: 'Aqua 220 ml',
//     satuan: 'Dus',
//     harga: '37.000',
//     supplier: 'PT. Angsa Dua',
//     alamatSupplier: 'Jl. Sukabangun',
//     telpSupplier: '082199890989',
// }]



    app.get('/api/airminum', (req, res)=>{
        connection.query('SELECT * FROM produk', (e, r)=>{
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

    app.get('/api/airminum/:id', (req, res)=> {
        const airminumid = req.params.id
        const air = airminum.find(e => e.id === airminumid)

        // jika tidak ditemukan 
        if (!air){
            return res
                .status(404)
                .send({
                    status: false,
                    message: 'Air Minum Not found ...'
                })
        }

        // jika ditemukan
        const result = {
            status: true,
            data: air
        }

        res.send(result)
    })

    app.post('/api/airminum', (req, res)=>{
        const schema = Joi.object({
            id: Joi.string().min(2).required(),
            category: Joi.string().required(),
            produk: Joi.string().required(),
            satuan: Joi.string().required(),
            harga: Joi.number().required(),
            supplier: Joi.string().required(),
            alamatsuplier: Joi.string().required(),
            telpsuplier: Joi.string().required(),
        })

        const {error} = schema.validate({
            id: req.body.id,
            category: req.body.category,
            produk: req.body.produk,
            satuan: req.body.satuan,
            harga: req.body.harga,
            supplier: req.body.supplier,
            alamatsuplier: req.body.alamatsuplier,
            telpsuplier: req.body.telpSupplier,
        })

        if (error) {
            return res
                    .status(400)
                    .send({status:false, message: error.details[0].message})
        }

        // save data
        const fid = req.body.id,
        const fcategory= req.body.category,
        const fproduk = req.body.produk,
        const fsatuan = req.body.satuan,
        const fharga = req.body.harga,
        const fnamasupplier = req.body.supplier,
        const falamatsuplier = req.body.alamatsuplier,
        const ftelpsuplier = req.body.telpsuplier,

        Connection.query("SELECT * FROM produk WHERE id='"+fid+"'", (e, r)=>{
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
                    message: 'Data Produk sudah Ada!!!'
                })
            }else{
                Connection.query("INSERT INTO produk VALUES('"+fid
                +"', '"+fcategory+"', '"+fproduk+"', '"+fsatuan+"', '"+fharga+"' , '"+fnamasupplier+"', '"+falamatsuplier+"', '"+ftelpsuplier+"')", (e, r)=>{
            
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


    app.put("/api/airminum/:id", (req, res) => {
        // Define the validation schema
        const schema = Joi.object({
            id: Joi.string().min(2).required(),
            category: Joi.string().required(),
            produk: Joi.string().required(),
            satuan: Joi.string().required(),
            harga: Joi.number().required(),
            dataSupplier:{
                idSupplier: Joi.string().min(2).required(),
                supplier: Joi.string().required(),
                alamatSupplier: Joi.string().required(),
                telpSupplier: Joi.string().required(),
            }
        });

        // Validate the request body
        const { error } = schema.validate({
            id: req.body.id,
            category: req.body.category,
            produk: req.body.produk,
            satuan: req.body.satuan,
            harga: req.body.harga,
            dataSupplier:{
                idSupplier: req.body.idSupplier,
                supplier: req.body.supplier,
                alamatSupplier: req.body.alamatSupplier,
                telpSupplier: req.body.telpSupplier,
            }
        });

        if (error) {
            return res.status(400).send({ status: false, message: error.details[0].message });
        }

        // Searching by ID
        const airminumid = req.params.id;
        const air = airminum.findIndex(e => e.id === airminumid);

        if (air === -1) {
            return res.status(404).send({ status: false, message: "Air Minum ID not found." });
        }
        // Update data
        airminum[air] = {
            id: req.body.id,
            category: req.body.category,
            produk: req.body.produk,
            satuan: req.body.satuan,
            harga: req.body.harga,
            dataSupplier: {
                idSupplier: req.body.idSupplier,
                supplier: req.body.supplier,
                alamatSupplier: req.body.alamatSupplier,
                telpSupplier: req.body.telpSupplier,
            },
        };
        res.send({ status: true, message: "Success" });
    });
        
    app.delete('/api/airminum/:id', (req, res) => {
        const airminumid = req.params.id;
        const index = airminum.findIndex((e) => e.id === airminumid);
    
        if (index === -1) {
        return res.status(404).send({
            status: false,
            message: 'Air Minum not found ...',
        });
        }
    
        // Remove the employee from the array
        airminum.splice(index, 1);
    
        res.send({ status: true, message: 'Air Minum deleted successfully' });
    });
        

app.listen(3000, ()=> console.log('Web service running on port 3000...'))