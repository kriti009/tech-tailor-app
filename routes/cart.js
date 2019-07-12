var express = require("express");
var Cart = require("../models/cart");
var router = express.Router();

router.get('/', (req, res)=>{
    Cart.find({}).then((result)=>{
        res.status(200).json(result)
    });
});
router.post('/', (req, res) => {
    var new_item = {
        product_id : req.query.product_id,
        user_id : req.query.user_id
    };
    Cart.create(new_item).then(()=>{
        res.status(201).send({'message' : 'new item added to cart'})
    }).catch(()=>{
        res.status(409);
    })
});
module.exports = router ; 