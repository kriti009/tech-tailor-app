var mongoose = require("mongoose");
var Address = require("./models/address");
// var Product = require("./models/product");

var data = [
   {
        pincode: 94590,
        area: "4402  Marietta Street",
        city: "Vallejo",
        state: "California",
        landmark:""
   },{
        pincode: 77021,
        area: "2934  Michael Street",
        city: "Houston",
        state: "Texas",
        landmark:"near pan thela"
   },{
        pincode: 32805,
        area: "4906  Ocala Street",
        city: "Orlando",
        state: "Florida",
        landmark:"near pani puri stall"
   },{
        pincode: 78213,
        area: "118  Weekley Street",
        city: "San Antonio",
        state: "Texas",
        landmark:""
   },{
        pincode: 10007,
        area: "2605  Mount Tabor",
        city: "New York",
        state: "New York",
        landmark:"near mochi wale bhaiya"
   },{
        pincode: 32202,
        area: "506  Brannon Avenue",
        city: "Jacksonville",
        state: "Florida",
        landmark:""
   }
]
function seedAddress(){
    //remove all data
    Address.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("All data removed");
        
        data.forEach(function(seed){
            Address.create(seed, function(err, data){
                if(err){
                    console.log(err);
                }
            });
        });
    });   
}
module.exports = seedAddress;

