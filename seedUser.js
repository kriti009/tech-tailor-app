var mongoose = require("mongoose");
var User = require("./models/user");
// var Product = require("./models/product");

var data = [
    {
        name: "kriti dewangan",
        phone_no : "8103116393",
        address: ["5d11ef4c550324195040f1ea","5d11ef4c550324195040f1eb"] ,
        email : "kriti.ritu.dew@gmail.com"
    },{
        name: "Yamini Ogare",
        phone_no : "8102445393",
        address: ["5d11ef4c550324195040f1eb","5d11ef4c550324195040f1ec","5d11ef4c550324195040f1ee","5d11ef4c550324195040f1ef"],
        email : "yamini_ogare@gmail.com"
    },{
        name: "Harman Singh",
        phone_no : "9121116393",
        address: ["5d11ef4c550324195040f1ed","5d11ef4c550324195040f1ee","5d11ef4c550324195040f1eb"],
        email : "harman.singh@gmail.com"
    }
]
function seedUser(){
    //remove all data
    User.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("All data removed");
        
        data.forEach(function(seed){
            User.create(seed, function(err, data){
                if(err){
                    console.log(err);
                }
            });
        });
    });   
}
module.exports = seedUser;

