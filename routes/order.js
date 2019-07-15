var express = require("express");
var Order = require("../models/order"),
    User = require("../models/user"),
    OrderCounter = require("../models/orderCounter");
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
        // _id : getNextSequence("order_id"),
        product : req.body.product,
        pickup_date : dateFormat(req.body.pickup_date, "isoDateTime"),
        user_id : req.body.user_id, 
        pickup_address : req.body.pickup_address,
        price: req.body.price,
        status: 'order placed',
    };
    // console.log("yo this is the if "+newOrder._id);
    var response = placeOrder(newOrder, req.body.user_id);
    if(response.success){
        res.status(200).json(response);    
    }else{
        res.status(400).json(response);
    }
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

async function placeOrder (data,user_id) {
    var auditTemplate = {
        status: 'order placed',
        date : Date.now(),
    }
    getNextSequence("order_id").then((id)=>{
        console.log(id);
        data._id = id
    });
    console.log(data);
    User.findById(user_id).then((user)=>{
        if(user==null)
            // res.status(404).json({success:false, message:"Wrong user credentials"});
            return ({success:false, message: "user not found"});
        else{
            Order.create(data, (err, order) => {
                if(err){
                    console.log(err);
                    // res.status(400).json({success: false, message: "couldn't place your order"})
                    return ({success: false, message: "couldn't place your order"})
                }else{
                    // console.log(order._id);
                    // console.log(getNextSequence("order_id"));
                    // order._id =  getNextSequence("order_id");
                    order.audit.push(auditTemplate);
                    user.orders.push(order._id);
                    order.save(()=>{
                        user.save(()=>{
                            // res.status(201).json({success: true,message : "new order placed"});
                            console.log("order placed and your order is : ", order._id);
                            return ({success: true,message : "new order placed"})
                            
                        })
                        
                    });
                    
                }
            });
        }
    }).catch()
}
function getNextSequence(name,data) {
    return new Promise ((resolve, reject)=>{
        // resolve(result.seq_val);
        OrderCounter.findOneAndUpdate({"_id" : name},{$inc: {seq_val :1} },(err, result)=>{
            if(!err){
                console.log(result);
                resolve(result.seq_val);
                    
            }
        })
    })
    
 }

module.exports = router ; 