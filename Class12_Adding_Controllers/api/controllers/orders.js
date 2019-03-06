const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req,res,next)=>{

    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs=>{
        console.log(docs);
        res.status(200).json({
            count:docs.length,
            orders:docs.map(doc=>{
                return {
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.orders_create_order = (req,res,next)=>{

    Product.findById(req.body.productId)
            .then(product=>{
                if (!product){
                    return res.status(404).json({
                        message:"Product not found"
                    });
                }
            const order = new Order ({
                _id: mongoose.Types.ObjectId(), 
                quantity: req.body.quantity,
                product: req.body.productId,
            });
            return order
            .save()
            })
            .then(result=>{
                console.log(result);
                res.status(201).json({
                    message:'Order stored',
                    createdOrder:{
                        _id:result._id,
                        product:result.product,
                        quantity:result.quantity,
        
                    },
                     request:{
                                type:'GET',
                                url:'http://localhost:3000/orders/' + result._id
                            }
                })
            })
            .catch(err=>{
                res.status(500).json({
                    message:"Product not found",
                    // error: err,
                })
            });
}

exports.orders_get_order = (req,res,next)=>{

    Order.findById(req.param.ObjectId)
          .exec()
          .then(order => {
              if(!order){
                  return res.status(404).json({
                      message:"Order not found"
                  });
              }
              res.status(200).json({
                  order: order,  request:{
                    type:'GET',
                    url:'http://localhost:3000/orders/' 
                }
              });
          })
          .catch(err => {
              res.status(500).json({
                error: err,
              });
          });
  

    // const id = req.params.orderId;
    // if (id === "special"){
    //     res.status(200).json({
    //         message :"You discovered the special id",
    //         id : id
    //     });
    // }else {
    //     res.status(200).json({
    //         message :"You passed id",
    //         id : id
    //     });

    // }
}

exports.order_delete_order = (req,res,next)=>{
    const id = req.params.orderId;
    Order.remove({_id:id})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:'Order Deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/orders/'
            },
            body: {ProductId:'ID', quantity:'Number'}

        });

    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

    // const id = req.params.orderId;
    // res.status(200).json({
    //     message : 'Product deleted',
    //     id : id
    // });
}