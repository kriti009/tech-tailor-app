var mongoose = require("mongoose");
// var User = require("./models/user");
// var Product = require("./models/product");
var  Technician = require("./models/technician");

var data = [
    {
       name: "Harman Singh",
       phone_no: "9131635359",
       address: "electronic City, Bengluru",
       email: "harman_singh@gmail.com"
    },{
        name: "Kriti Dewangan",
        phone_no: "8103116393",
        address: "Kudlu Gate, Bengluru",
        email: "kriti_dew@gmail.com"
     },{
        name: "Yamini Ogare",
        phone_no: "8001635359",
        address: "Kudlu Gate, Bengluru",
        email: "Yaminiogare@gmail.com"
     },
]
function seedTechnician(){
    //remove all data
    Technician.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("All data removed");
        
        data.forEach(function(seed){
            Technician.create(seed, function(err, data){
                if(err){
                    console.log(err);
                }
            });
        });
    });   
}
module.exports = seedTechnician;

