var mongoose = require("mongoose");
// var User = require("./models/user");
var Order = require("./models/order");

var data = [
    {
        product_id : "5d00cc5c6dc1380017a2391b",
        user_id : "5d023b68d5cc630017233954",
        pickup_address: "ashwani nagar, raipur,cg",
        pickup_date : Date.now(),
        pickup_time :"3pm",
        status: "order placed",
    },{
        product_id : "5d00cc5c6dc1380017a2391a",
        user_id : "5d04d0db084231001788185a",
        pickup_address: "Kudlu Gate, bangalore",
        pickup_date : Date.now(),
        pickup_time :"12Am",
        status: "order placed",
    },{
        product_id : "5d00cc5c6dc1380017a2391e",
        user_id : "5d04d0db084231001788185a",
        pickup_address: "Kudlu Gate, bangalore",
        pickup_date : Date.now(),
        pickup_time :"5AM",
        status: "alteration in progress",
    },{
        product_id : "5d00cc5c6dc1380017a2391f",
        user_id : "5d076ce20d753a0017cdf436",
        pickup_address: "Kormangalam, bangalore",
        pickup_date : Date.now(),
        pickup_time :"1Pm",
        status: "order picked-up",
    },{
        product_id : "5d00cc5c6dc1380017a2391a",
        user_id : "5d077300b932a100175fb0b1",
        pickup_address: "Durg, Cg",
        pickup_date : Date.now(),
        pickup_time :"3pm",
        status: "order delivered",
    },
]
function seedOrder(){
    //remove all data
    Order.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("All data removed");
        
        data.forEach(function(seed){
            Order.create(seed, function(err, data){
                if(err){
                    console.log(err);
                }
            });
        });
    });   
}
module.exports = seedOrder;

