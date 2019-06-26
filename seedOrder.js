var mongoose = require("mongoose");
// var User = require("./models/user");
var Order = require("./models/order");

var data = [
    {
        product : ["5d00cc5c6dc1380017a2391b", "5d00cc5c6dc1380017a2391a"],
        user_id : "5d11effa5e770b34d86bc2a7",
        pickup_address: "ashwani nagar, raipur,cg",
        pickup_date : Date.now(),
        pickup_time :"3pm",
        status: "order placed",
        total_quantity: 3,
        audit : [{
            status: "order placed",
            date: Date.now(),
        }]
    },{
        product : ["5d00cc5c6dc1380017a2391a"],
        user_id : "5d11effa5e770b34d86bc2a9",
        pickup_address: "Kudlu Gate, bangalore",
        pickup_date : Date.now(),
        pickup_time :"12Am",
        status: "order placed",
        total_quantity: 2,
        audit : [{
            status: "order placed",
            date: Date.now(),
        }]
    },{
        product : ["5d00cc5c6dc1380017a2391e"],
        user_id : "5d11effa5e770b34d86bc2a8",
        pickup_address: "Kudlu Gate, bangalore",
        pickup_date : Date.now(),
        pickup_time :"5AM",
        status: "alteration in progress",
        total_quantity: 3,
        audit : [{
            status: "order placed",
            date: Date.now(),
        }]
    },{
        product : ["5d00cc5c6dc1380017a2391f"],
        user_id : "5d11effa5e770b34d86bc2a8",
        pickup_address: "Kormangalam, bangalore",
        pickup_date : Date.now(),
        pickup_time :"1Pm",
        status: "order picked-up",
        total_quantity: 5,
        audit : [{
            status: "order placed",
            date: Date.now(),
        }]
    },{
        product : ["5d00cc5c6dc1380017a2391f"],
        user_id : "5d11effa5e770b34d86bc2a7",
        pickup_address: "Durg, Cg",
        pickup_date : Date.now(),
        pickup_time :"3pm",
        status: "order delivered",
        total_quantity: 1,
        audit : [{
            status: "order placed",
            date: Date.now(),
        }]
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

