var mongoose = require("mongoose");
// var User = require("./models/user");
var Product = require("./models/product");

var data = [
    {
        gender : 'male',
        image_url : "https://cdn.pixabay.com/photo/2017/09/12/19/29/twins-2743367_960_720.jpg",
        service_type: 'Shorten Sleeves',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 30,
        is_available : true,
    },{
        gender : 'male',
        image_url : "https://image.shutterstock.com/z/stock-photo-girls-beautiful-yellow-skinny-trousers-modern-pockets-yellow-trousers-for-teenagers-isolated-on-712737529.jpg",
        service_type: 'Shorten trouser',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 50,
        is_available : true,
    },{
        gender : 'male',
        image_url : "https://image.shutterstock.com/z/stock-photo-close-up-male-hand-putting-contemporary-phone-in-pocket-of-trousers-he-standing-indoor-1186128400.jpg",
        service_type: 'waist alteration',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 70,
        is_available : true,
    },{
        gender : 'male',
        image_url : "https://cdn.pixabay.com/photo/2015/03/26/09/40/business-suit-690048_960_720.jpg",
        service_type: 'shorten jacket/ coat',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 170,
        is_available : true,
    },{
        gender : 'male',
        image_url : "https://cdn.pixabay.com/photo/2016/06/06/13/34/trouser-pockets-1439412_960_720.jpg",
        service_type: 'Tuxedo Alterations',
        category: 'formal',
        description: "Our most popular alteration for men, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 500,
        is_available : true,
    },{
        gender : 'female',
        image_url : "https://cdn.pixabay.com/photo/2016/10/15/23/52/foot-1744044_960_720.jpg",
        service_type: 'shorten skirt',
        category: 'informal',
        description: "Our most popular alteration for women, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 230,
        is_available : true,
    },{
        gender : 'female',
        image_url : "https://cdn.pixabay.com/photo/2015/09/05/21/57/girl-925635_960_720.jpg",
        service_type: 'narrowing trouser legs',
        category: 'informal',
        description: "Our most popular alteration for women, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 170,
        is_available : true,
    },{
        gender : 'female',
        image_url : "https://image.shutterstock.com/image-photo/fashion-model-wearing-blank-black-450w-605246366.jpg",
        service_type: 'add Sleeves',
        category: 'informal',
        description: "Our most popular alteration for women, for anything from jeans to suit alterations. We request that you safety pin the trousers with a single pin in one leg to the length that you'd like them shortened to, or include a clearly marked pair that fit perfectly, to be copied. Alternatively, you can let us know in the notes (when adding to cart) how much you'd like taken off in cms or inches.",
        alteration_price : 50,
        is_available : true,
    },{
        gender : 'female',
        image_url : "https://image.shutterstock.com/image-photo/group-four-young-diverse-girls-450w-605616242.jpg",
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

