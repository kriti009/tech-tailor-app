var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    twilio = require('twilio');

//requiring models
var User = require('./models/user');
var Order = require("./models/order");
var Category = require("./models/category");
var Cart = require('./models/cart');
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
    Product.find({}).then((data) => {
        res.status(200).json(data);
    })
});
app.get('/products/:id', (req, res) =>{
    Product.findById(req.params.id).then((result)=>{
        res.status(200).json(result)
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
});
app.get("/product_by_category/:gender", (req,res) => {
    // var category_name = req.query.name;
    // console.log(req.params.gender);

    Category.findOne({"name" : req.params.gender}, (err,category) => {
        if(err)
            console.log(err)
        else{
            // res.json(category);
            Product.find({"gender": category.name}, (err, products) => {
                if(err)
                    console.log(err);
                else{
                    res.json(products);
                }
            })
        }
    });
});

app.get('/cart', (req, res)=>{
    Cart.find({}).then((result)=>{
        res.status(200).json(result)
    });
});
app.post('/add_to_cart', (req, res) => {
    var new_item = {
        product_id : req.query.product_id,
        user_id : req.query.user_id
    };
    Cart.create(new_item).then(()=>{
        res.status(201).send({'message' : 'new item added to cart'})
    }).catch(()=>{
        res.status(409);
    })
});
app.get('/get_all_orders', (req, res)=>{
    Order.find({}).then((result)=>{
        res.status(200).json(result);
    });
});
app.post('/place_order', (req, res) => {
    var newOrder = {
        product_id : req.query.product_id,
        user_id : req.query.user_id,
        pickup_date: req.query.pickup_date,
        pickup_time : req.query.pickup_time,    
        pickup_address : req.query.pickup_address,
        status: 'order placed',
    };
    Order.create(newOrder, (err, order) => {
        if(err){
            console.log(err);
        }else{
            res.status(201).send({'message' : "new order placed"});
            console.log("order placed and your order Id is : ", order._id);
        }
    });
});
app.put('/update_status', (req, res)=>{
    var new_status = req.query.status;
    Order.findById(req.query.order_id).then((result) => {
        result.status = new_status;
        result.save();
        res.status(202).send(result);
    });
});

app.listen( process.env.PORT || 8000  , () => {
    console.log("Server Connected");
})