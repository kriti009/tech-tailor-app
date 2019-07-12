var express = require("express");
var User  = require("../models/user");
var Address = require("../models/address");
var router = express.Router();

router.get('/details', (req, res) => {
    User.findById(req.query.user_id).populate("address").then((result)=>{
        if(result==null)
            res.status(400).json({success: false, message: "User not Found"});
        var address = result.address.map((h,i)=>(
            h.area.concat(", ",h.city, ", ",h.state,", ",h.pincode)
        ));
        // result.address.concat(' ', str2)
        res.status(200).json({name: result.name, email: result.email, phone_no: result.phone_no, address :address});
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal error"});
    })
});
router.get('/orders', (req,res)=>{
    User.findById(req.query.user_id)
    .populate({path: 'orders', populate: { path: 'pickup_address' }})
    .then((user)=>{
        if(user==null)
            res.status(404).json({success: false, message: "No such user/orders exits"});
        res.status(200).json(user.orders);
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal error"});
    })
});
router.get('/address',(req, res)=>{
    var user_id = req.query.user_id;
    User.findById(user_id).populate("address").then((result)=>{
        if(result==null){
            res.status(404).json({success:false, message:"NO such user or address exits"})
        }else{
            res.status(200).json({success:true, address: result.address})
        }
    })
});
router.put('/address', (req, res)=>{
    var edited_address = {
        pincode : req.query.pincode,
        area : req.query.area,
        city: req.query.city,
        state: req.query.state,
        landmark: req.query.landmark,
    };
    if(edited_address.landmark==null){
        edited_address.landmark = "";
    };
    var address_id = req.query.address_id;
    // var user_id = req.query.user_id;
    Address.findByIdAndUpdate(address_id, edited_address).then((result)=>{
        if(result==null)
            res.status(400).json({success: false, message: "error"});
        else
            res.status(200).json({success: true, message:"saved changes"});
    }).catch(()=>{
        res.status(400).json({success: false, message: "internal error"})
    })
});
router.post('/address', (req,res)=>{
    var new_address = {
        pincode : req.query.pincode,
        area : req.query.area,
        city: req.query.city,
        state: req.query.state,
        landmark: req.query.landmark,
    };
    if(new_address.landmark==null){
        new_address.landmark = "";
    };
    var user_id = req.query.user_id;
    Address.create(new_address).then((address)=>{
        User.findById(user_id).then((user)=>{
            if(user==null)
                res.status(400).json({success: false, message: "internal error"});
            else{
                user.address.push(address._id);
                user.save(()=>{
                    res.status(200).json({success: true, message: "new address added" ,address_id: address._id});
                });
            }
        })
    }).catch(()=>{
        res.status(400).json({success: falses, message: "internal error"});
    })
});

module.exports = router ; 