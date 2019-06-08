var mongoose = require("mongoose");
// var User = require("./models/user");
// var Product = require("./models/product");
var  Category = require("./models/category");

var data = [
    {
       name: 'male',
       image_url: 'https://cdn.pixabay.com/photo/2015/03/26/09/41/tie-690084_960_720.jpg'
    },{
        name: 'female',
        image_url: "https://cdn.pixabay.com/photo/2016/11/22/06/05/girl-1848454_960_720.jpg"
    },{
        name: 'kid',
        image_url: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
    
    }
]
function seedCategory(){
    //remove all data
    Category.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("All data removed");
        
        data.forEach(function(seed){
            Category.create(seed, function(err, data){
                if(err){
                    console.log(err);
                }
            });
        });
    });   
}
module.exports = seedCategory;

