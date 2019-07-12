var express = require("express");
var Product = require("../models/product");
var Category = require("../models/category");
var router = express.Router();

router.get('/products',(req, res) => {
    Product.find({}).then((data) => {
        res.status(200).json(data);
    })
});
router.get('/products/:id', (req, res) =>{
    Product.findById(req.params.id).then((result)=>{
        res.status(200).json(result)
    })
})
router.put('/products', (req, res)=>{
    var data = {
        service_type : req.body.service_type,
        gender : req.body.gender,
        image_url: req.body.image_url,
        short_description: req.body.short_description,
        description: req.body.description,
        alteration_price : req.body.alteration_price,
    }
    Product.findByIdAndUpdate(req.body._id, data).then((result)=>{
        if(result != null){
            res.status(200).json({success: true, message: "Product Updated"});
        }
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal Error"});
    })
});
router.post("/products", (req, res)=>{
    var data = {
        service_type : req.body.service_type,
        gender : req.body.gender,
        image_url: req.body.image_url,
        short_description: req.body.short_description,
        description: req.body.description,
        alteration_price : req.body.alteration_price,
    }
    Product.create(data).then((result)=>{
        res.status(200).json({success: true, message: "new product added", product_id: result._id});
    }).catch(()=>{
        res.status(400).json({success: false, message:"Internal error, could not add product"})
    })
})
router.delete("/products", (req, res)=>{
    Product.findByIdAndDelete(req.body._id).then(()=>{
        res.status(200).json({success: true, message:"Product Deleted succesfully"});
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal error, Can't Delete this item"})
    })
});
router.get("/product_by_category/:gender", (req,res) => {
    Category.findOne({"name" : req.params.gender}, (err,category) => {
        if(err)
            console.log(err)
        else{
            // res.json(category);
            Product.find({"gender": category.name}, (err, products) => {
                if(err)
                    console.log(err);
                else{
                    res.json(products);
                }
            })
        }
    });
});

module.exports = router; 