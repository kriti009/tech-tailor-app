var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    twilio = require('twilio');

//requiring models
var User = require('./models/user');
var Order = require("./models/order");
var Category = require("./models/category");
// var Cart = require('./models/cart');
var Product = require('./models/product');
var seedDB = require("./seedDb");
var seedUser = require("./seedUser");
var seedCategory = require("./seedCategory");

// mongodb://kriti09:rachana123@ds233167.mlab.com:33167/tech-tailor
var mongoDB = 'mongodb://kriti09:rachana123@ds233167.mlab.com:33167/tech-tailor';
// mongoose.connect("mongodb://localhost:27017/tech-tailor",{ useNewUrlParser: true});
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

//seeding DB
// seedDB();
// seedUser();
// seedCategory();

// app.set("view engine", "ejs");
// app.use(methodOverride("_method"));


app.get('/products', (req, res) => {
    Product.find({}, (err, data) =>{
        if(err)
            console.log(err);
        else
            res.json(data);
    })
});
app.get('/products/:id', (req, res) =>{
    Product.findById(req.params.id, (err, data) => {
        if(err){
            console.log(err);
        }else{
            res.json(data);
        }
    })
})
app.get('/get_user_details', (req, res) => {
    User.findById(req.query.user_id, (err, user) => {
        if(err){
            console.log(err);
        }else{
            res.json(user);
        }
    })
});
app.get("/get_category", (req, res)=> {
    Category.find({} , (err, category) => {    
        res.json(category);
    })    
})

app.post('/place_order', (req, res) => {
    var newOrder = {
        product_id : req.query.product_id,
        user_id : req.query.user_id,
        pickup_date: req.query.pickup_date,
        pickup_time : req.query.pickup_time,    
        pickup_address : req.query.pickup_address
    };
    Order.create(newOrder, (err, order) => {
        if(err){
            console.log(err);
        }else{
            console.log("order placed and your order Id is : ", order._id);
        }
    });
});

app.listen( process.env.PORT || 8000  , () => {
    console.log("Server Connected");
})