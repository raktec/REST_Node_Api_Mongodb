const Product = require("../models/product");
const mongoose = require('mongoose');
const multer = require('multer');


exports.products_get_all = (req, res, next) => {

    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs=>{

        const response = {
            count:docs.length,
            product:docs.map(doc=>{
                return {
                    name:doc.name,
                    price:doc.price,
                    productImage:doc.productImage,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    }
    );
}

exports.products_create_product = (req, res, next) => {
    //console.log(req.body.name);
   
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
       // productImage:req.file.path,
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created Product Successfully",
            createProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From Database" ,doc);
            // res.status(200).json({ doc });
            if (doc){
                res.status(200).json({
                    product: doc ,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/' + doc._id
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;    
    }
    Product.update({_id:id},{ $set: updateOps })
    .exec()
    .then(result=>{
        console.log(result);
        // res.status(200).json(result);
        res.status(200).json({
            message:'Product Updated',
            request:{
                type:'GET',
                url:'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err=>{
        console.log(error);
        res.status(500).json({
            error:err
        });
    });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:'Product Deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/products/'
            },
            body: {name:'String', price:'Number'}

        });

    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}


// const upload = multer({dest:'uploads/'});



// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb('null','./uploads/');
//     },
//     filename: function(req,file,cb){
//         cb('null', new Date().toISOString + file.originalname);
//     },
// });

// const fileFilter = (req,file,cb) => {
//     //reject a file
//     if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
//         cb(null,true);
//     }else {
//         cb(null,false);
//     }
// }

// const upload = multer({
//     storage:storage, 
//     limits:{
//         fileSize: 1024 * 1024 * 10
//     },
//     fileFilter: fileFilter
// });