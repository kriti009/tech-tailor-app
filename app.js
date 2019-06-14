var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    speakeasy = require('speakeasy'),
    otplib = require('otplib'),
    jwt = require('jsonwebtoken'),
    jwtDecode = require('jwt-decode');
    
var config = require('./config');
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

app.set('superSecret', config.secret);
app.use(bodyParser.json());t sta
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));
otplib.authenticator.options = {
    step: 120,
  };
//seeding DB
// seedDB();
// seedUser();
// seedCategory();

// app.set("view engine", "ejs");
// app.use(methodOverride("_method"));


// var secret = otplib.authenticator.generateSecret();
var otp_secret = "N4YGKYRTNFFGMTZYLB4U2L3OJZGFQYLV";

app.get('/generate_otp/:no', (req,res)=>{
    var phone_no = req.params.no;
    const token = otplib.authenticator.generate(otp_secret);
    res.json({success: true, token: token});
});
app.post('/signup/verify_otp', (req,res)=>{    
    var user_token = req.query.token;
    var device_id = req.query.device_id;
    var new_user = {
        name: req.query.name,
        password: req.query.password,
        email: req.query.email,
        phone_no: req.query.phone_no,
        role: 'customer',
        address: req.query.address,
    };
    if(otplib.authenticator.check(user_token, otp_secret)){
        // res.json({success: true, message: "OTP matched!"});
        User.create(new_user).then((user)=>{
            // const payload = {
            //     name: user.name,
            //     device_id: device_id,
            // };
            // var token = jwt.sign(payload, app.get('superSecret'), {
            //     expiresIn: '24h' //  
            // });
            // user.jwtToken.push(token);
            // user.save();
            // //return the info including token as json
            // res.json({
            //     success: true,
            //     message: 'token generated',
            //     user: user,
            // });
            res.send(generateNewJWT(user, device_id));
        })
    }
    else
        res.json({success: false, message: "authentication failed."});
});
app.post('/login/verify_otp', (req, res)=>{
    var user_token = req.query.token;
    var device_id = req.query.device_id;
    var phone_no = req.query.phone_no;
    // var user_id = req.query.user_id;
    // console.log(phone_no);
    if(otplib.authenticator.check(user_token, otp_secret)){
        User.findOne({'phone_no': phone_no}, (err, user) => {
            if(err){
                console.log(err);
            }else{
                var decoded = [];
                user.jwtToken.forEach((t)=>{
                    if(jwtDecode(t).device_id == device_id)
                        res.json({success: true, message: "welcome back "+ jwtDecode(t).name});
                });
                //generate new token with encoded device id and push it into jwtToken param in User
                res.send(generateNewJWT(user, device_id));
            }
        })
        
    }else{
        res.json({success: false, message: "authentication failed."});
    }
    
})
app.post('/signup', (req,res)=>{
    var phone_no = req.query.phone_no;
    res.redirect('/generate_otp/'+phone_no);
});
app.post('/login', (req, res)=>{
    var phone_no = req.query.phone_no;
    // console.log(phone_no);
    User.findOne({'phone_no': phone_no}).then((user)=>{
        if(user==null)
            res.status(404).json({success: false, message: "User does no exixts"});
        res.redirect("/generate_otp/"+phone_no);
    }).catch((e) => {
        res.status(404).json({success: false, message: "User does no exixts"});
    })
    
});
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

function generateNewJWT (user , device_id){
    const payload = {
        name: user.name,
        device_id: device_id,
    };
    var token = jwt.sign(payload, app.get('superSecret'), {
        expiresIn: '24h' //  
    });
    user.jwtToken.push(token);
    user.save();
    //return the info including token as json
     return {
        success: true,
        message: 'token generated',
        user: user,
    };
}


app.listen( process.env.PORT || 8000  , () => {
    console.log("Server Connected");
})