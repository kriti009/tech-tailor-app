var express = require("express");
var Category = require("../models/category");
var router = express.Router();

router.get("/", (req, res)=> {
    Category.find({} , (err, category) => {    
        res.json(category);
    })    
});
router.post('/', (req, res)=>{
    var new_category = {
        name : req.body.name,
        image_url : req.body.image_url,
    };
    Category.create(new_category).then(()=>{
        res.status(200).json({success: true, message: "New Category saved"});
    }).catch(()=>{
        res.status(400).json({success: true, message: "Internal error"});
    })
});
module.exports = router; 