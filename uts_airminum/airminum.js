// this how to call a depedency for use
const express = require('express')
const Joi = require('joi')

const Connection = require('./database')
const auth = require('./auth')

const router = express.Router()

    router.get('/', auth, (req, res)=>{
        Connection.query('SELECT * FROM produk', (e, r)=>{
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

    router.get('/:id', auth, (req, res)=> {
        // get data request from body/params and set to produkId variable
        const produkId = req.params.id

		Connection.query("SELECT * FROM produk WHERE id='"+produkId+"'", (e, r)=>{
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
					message: 'Id Product Doesnot found!!!'
				})
			}
 
			res.status(200).send({
				status: true,
				data: r,
			})
		})
    })

    router.post('/', auth, (req, res)=>{
        const schema = Joi.object({
            id: Joi.string().min(2).required(),
            category: Joi.string().required(),
            produk: Joi.string().required(),
            satuan: Joi.string().required(),
            harga: Joi.number().required(),
            namasuplier: Joi.string().required(), 
            alamatsuplier: Joi.string().required(), 
            telpsuplier: Joi.string().required(),
        })

        const {error} = schema.validate({
            id: req.body.id,
            category: req.body.category,
            produk: req.body.produk,
            satuan: req.body.satuan,
            harga: req.body.harga,
            namasuplier: req.body.namasuplier,
            alamatsuplier: req.body.alamatsuplier,  
            telpsuplier: req.body.telpsuplier,
        })

        if (error) {
            return res
                .status(400)
                .send({
                    status:false, 
                    message: error.details[0].message
                })
        }

        // set data to field as request from form body
        const fid = req.body.id
        const fcategory= req.body.category
        const fproduk = req.body.produk
        const fsatuan = req.body.satuan
        const fharga = req.body.harga
        const fnamasuplier = req.body.namasuplier
        const falamatsuplier = req.body.alamatsuplier
        const ftelpsuplier = req.body.telpsuplier 

        Connection.query("SELECT * FROM produk WHERE id='"+fid+"'", (e, r)=>{
            if (e) {
                return res.status(500).send({
                    status: false,
                    message: 'Internal Server Error !!!',
                })	
            }
            // if data found
            if (r.length > 0) {
                return res.status(400).send({
                    status: false,
                    message: 'Data Produk sudah Ada!!!'
                })
            }else{
                Connection.query("INSERT INTO produk VALUES('"+fid
                +"', '"+fcategory+"', '"+fproduk+"', '"+fsatuan+"', '"+fharga+"' , '"+fnamasuplier+"', '"+falamatsuplier+"', '"+ftelpsuplier+"')", (e, r)=>{
            
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
                            id  : fid ,
                            category : fcategory,
                            product  : fproduk ,
                            satuan  : fsatuan ,
                            harga : fharga ,
                            namasuplier  : fnamasuplier ,
                            alamatsuplier  : falamatsuplier ,
                            telpsuplier : ftelpsuplier  ,

                        },
                    })
                })
            }
        })
    })


    router.put("/:id", auth, (req, res) => {
        const idAir = req.params.id;
    
        Connection.query("SELECT * FROM produk WHERE id = '" + idAir + "'", (e, r) => {
            if (r.length > 0) {
                // Define the validation schema
                const schema = Joi.object({
                    category: Joi.string().required(),
                    produk: Joi.string().required(),
                    satuan: Joi.string().required(),
                    harga: Joi.number().required(),
                    namasuplier: Joi.string().required(),
                    alamatsuplier: Joi.string().required(),
                    telpsuplier: Joi.string().required(),
                });
    
                const { error } = schema.validate({
                    category: req.body.category,
                    produk: req.body.produk,
                    satuan: req.body.satuan,
                    harga: req.body.harga,
                    namasuplier: req.body.namasuplier,
                    alamatsuplier: req.body.alamatsuplier,
                    telpsuplier: req.body.telpsuplier,
                });
    
                if (error) {
                    return res.status(400).send({
                        status: false,
                        message: error.details[0].message
                    });
                }
    
                const updateData = {
                    category: req.body.category,
                    produk: req.body.produk,
                    satuan: req.body.satuan,
                    harga: req.body.harga,
                    namasuplier: req.body.namasuplier,
                    alamatsuplier: req.body.alamatsuplier,
                    telpsuplier: req.body.telpsuplier,
                };
    
                Connection.query("UPDATE produk SET ? WHERE id = ?", [updateData, idAir], (e, r) => {
                    if (e) {
                        return res.status(500).send({
                            status: false,
                            message: 'Internal server Error!!'
                        });
                    }
                    res.status(200).send({
                        status: true,
                        message: 'Update Data Product Success!!!'
                    });
                });
            } else {
                res.status(404).send({
                    status: false,
                    message: 'Data Not Found!!!'
                });
            }
        });
    });
        
    router.delete('/:id', auth, (req, res) => {
        
        const airminumid = req.params.id;

        Connection.query("DELETE FROM produk WHERE id ='"+airminumid+"'" ,(e,r)=>{

            if (r.length >0) {
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
                        message: 'Delete Product Success!!!',
                    }
                )

            }else{
                res.status(404).send({
                    status: false,
                    message: 'Data Not Found!!!'
                })
            }
		})
    });
        

    module.exports = router