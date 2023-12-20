const express = require('express')
const Joi = require('joi')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))



var airminum = [{
    id: '01',
    category: 'Gelas/Cup',
    produk: 'Aqua 220 ml',
    satuan: 'Dus',
    harga: '37.000',
    dataSupplier: {
        idSupplier: '01',
        supplier: 'PT. Angsa Dua',
        alamatSupplier: 'Jl. Sukabangun',
        telpSupplier: '082199890989',
    },
},{
    id: '02',
    category: 'Botol',
    produk: 'Le Minerale 450 ml',
    satuan: 'Dus',
    harga: '48.000',
    dataSupplier: {
        idSupplier: '02',
        supplier: 'PT. Nia Maraya',
        alamatSupplier: 'Jl. Pegunungan Bukit',
        telpSupplier: '083376236789',
    },
},{
    id: '03',
    category: 'Botol',
    produk: 'Cleo Water Mineral 450 ml',
    satuan: 'Dus',
    harga: '51.000',
    dataSupplier: {
        idSupplier: '03',
        supplier: 'PT. Mayang Gemilang Jaya',
        alamatSupplier: 'Jl. 16 Ilir Palembang',
        telpSupplier: '089176234566',
    },
}]



    app.get('/api/airminum', (req, res)=>{
        const result = {
            status: true,
            data: airminum
        }

        res.send(result)
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
            dataSupplier:{
                idSupplier: Joi.string().min(2).required(),
                supplier: Joi.string().required(),
                alamatSupplier: Joi.string().required(),
                telpSupplier: Joi.string().required(),
            }
        })

        const {error} = schema.validate({
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
        })

        if(error){
            return res

            .status(400)
            .send({ststus: false, message: error.details[0].message})
        }

        const tempAirminum = {
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
        }

        airminum.push(tempAirminum)

        res.send({status: true, data: airminum})

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