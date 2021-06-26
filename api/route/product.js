const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../model/product');
const checkAuth = require('../middleware/check-auth');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dmap97ds2',
  api_key: '392635253424173',
  api_secret: 'UwIU2QdVR_S7KCsxfnxKEtLJ64k'
});

// get request
router.get('/',checkAuth,(req,res,next)=>{
  Product.find()
  .exec()
  .then(result=>{
    res.status(200).json({
      Product:result
    })
  })
})

// get by id request
router.get('/:id',checkAuth,(req,res,next)=>{
  const _id = req.params.id;

  Product.findById(_id)
  .exec()
  .then(result =>{
      console.log(result);
      res.status(200).json({
          product:result
      })

  })
})

// post request
router.post('/',checkAuth,(req,res,next)=>{
  console.log(req.body);
  const file = req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
    console.log(result);
    product = new Product({
      _id: new mongoose.Types.ObjectId,
      code:req.body.code,
      title:req.body.title,
      description:req.body.description,
      mrp:req.body.mrp,
      sp:req.body.sp,
      discountPercent:req.body.discountPercent,
      imagePath:result.url
  });
  product.save()
  .then(result=>{
      console.log(result);
      res.status(200).json({
          new_product:result
      })
  })
  .catch(err=>{
      console.log(err);
      res.status(500).json({
          Error:err
      })
  })
  });

})

// delete request
router.delete('/:id',checkAuth,(req,res,next)=>{
  Product.remove({_id:req.params.id})
  .then(result=>{
    res.status(200).json({
      message:'product deleted',
      result:result
    })
  })
  .catch(err=>{
    res.status(500).json({
      error:err
    })
  })
})

// put request
router.put('/:id',checkAuth,(req,res,next)=>{
  console.log(req.params.id);
  Product.findOneAndUpdate({_id:req.params.id},{
    $set:{
      code:req.body.code,
      title:req.body.title,
      description:req.body.description,
      mrp:req.body.mrp,
      sp:req.body.sp,
      discountPercent:req.body.discountPercent,
      imagePath:req.body.imagePath
    }
  })
  .then(result=>{
    res.status(200).json({
      updated_product:result
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
})






module.exports = router;
