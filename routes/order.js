var express = require("express");
var Order = require("../models/order"),
    User = require("../models/user");
var dateFormat = require('dateformat');
var router = express.Router();

router.get('/get_order_details', (req, res)=>{
    Order.findById(req.query.order_id).populate('product.product_id').populate('pickup_address').then((order)=>{
        if(order==null)
            res.status(404).json({success: false, message: "No such order exits"});
        var address = order.pickup_address.area.concat(", ",order.pickup_address.city, ", ",order.pickup_address.state,", ",order.pickup_address.pincode);
        res.status(200).json(order);
    }).catch()
})
router.get('/get_all_orders' , (req, res)=>{
    Order.find({}).populate('user_id').populate("product.product_id").populate("pickup_address").then((result)=>{
        res.status(200).json(result);    
    });
});
router.post('/place_order', (req, res) => {
    console.log(req.body.pickup_date);
    console.log(dateFormat(req.body.pickup_date, "isoDateTime"));
    var newOrder = {
        product : req.body.product,
        pickup_date : dateFormat(req.body.pickup_date, "isoDateTime"),
        user_id : req.body.user_id, 
        pickup_address : req.body.pickup_address,
        price: req.body.price,
        status: 'order placed',
    };
    var auditTemplate = {
        status: 'order placed',
        date : Date.now(),
    }
    User.findById(req.body.user_id).then((user)=>{
        if(user==null)
            res.status(404).json({success:false, message:"Wrong user credentials"});
        else{
            Order.create(newOrder, (err, order) => {
                if(err){
                    res.status(400).json({success: false, message: "couldn't place your order"})
                }else{
                    order.audit.push(auditTemplate);
                    user.orders.push(order._id);
                    order.save(()=>{
                        user.save(()=>{
                            res.status(201).json({success: true,message : "new order placed"});
                            console.log("order placed and your order is : ", order._id);
                        })
                        
                    });
                    
                }
            });
        }
    }).catch()
});
router.put('/update_status', (req, res)=>{
    var new_status = req.body.status;
    // console.log(req);
    // console.log(res);
    var auditTemplate = {
        status: new_status,
        date : Date.now(),
        updated_by: req.body.updated_by,
    };
    Order.findById(req.body.order_id).then((result) => {
        result.status = new_status;
        result.audit.push(auditTemplate);
        result.save(()=>{
            console.log("Status upadated");
        });
        res.status(202).json(result);
    });
});
router.put('/assign_technician', (req, res)=>{
    var auditTemplate = {
        status: "technician assigned",
        date : Date.now(),
        updated_by: req.body.updated_by,
        remark: `technician assigned: ${req.body.technician}`,
    };
    Order.findById(req.body.order_id).then((result)=>{
        // console.log(req.body.technician);
        result.technician = req.body.technician;
        result.status = "technician assigned";
        result.audit.push(auditTemplate);
        result.save(()=>{
            console.log("new technician assigned");
            // console.log(result);
        });
        res.status(202).json(result);
    });
});

module.exports = router ; 