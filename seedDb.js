var mongoose = require("mongoose");
// var User = require("./models/user");
var Product = require("./models/product");

var data = [
    {
        gender : 'm',
        image_url : "https://freephotos.cc/suit#2254117",
        service_type: 'Shorten Sleeves',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 30,
        is_available : true,
    },{
        gender : 'm',
        image_url : "https://freephotos.cc/trouser#603022",
        service_type: 'Shorten trouser',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 50,
        is_available : true,
    },{
        gender : 'm',
        image_url : "https://freephotos.cc/pants#1598507",
        service_type: 'waist alteration',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 70,
        is_available : true,
    },{
        gender : 'm',
        image_url : "https://freephotos.cc/suit#1282309",
        service_type: 'shorten jacket/ coat',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 170,
        is_available : true,
    },{
        gender : 'm',
        image_url : "https://freephotos.cc/suit#1282309",
        service_type: 'Tuxedo Alterations',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 500,
        is_available : true,
    },{
        gender : 'f',
        image_url : "https://freephotos.cc/shirt#297933",
        service_type: 'shorten skirt',
        category: 'informal',
        description: "Our most popular alteration for women, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 230,
        is_available : true,
    },{
        gender : 'f',
        image_url : "https://freephotos.cc/narrow-pants#2363825",
        service_type: 'narrowing trouser legs',
        category: 'informal',
        description: "Our most popular alteration for women, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 170,
        is_available : true,
    },{
        gender : 'f',
        image_url : "http://istockphoto.7eer.net/c/372642/258824/4205?u=https%3A%2F%2Fwww.istockphoto.com%2Fphoto%2Fgetting-ready-to-work-gm185089325-19514061&sharedid=GoogleSearch",
        service_type: 'add Sleeves',
        category: 'informal',
        description: "Our most popular alteration for women, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 50,
        is_available : true,
    },{
        gender : 'f',
        image_url : "https://freephotos.cc/waist-fit-jeans#53528",
        service_type: 'waist fitting',
        category: 'informal',
        description: "Our most popular alteration for women, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 230,
        is_available : true,
    },
]
function seedDB(){
    //remove all data
    Product.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("All data removed");
        
        data.forEach(function(seed){
            Product.create(seed, function(err, data){
                if(err){
                    console.log(err);
                }
            });
        });
    });   
}
module.exports = seedDB;

