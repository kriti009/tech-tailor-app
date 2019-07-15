var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    speakeasy = require('speakeasy'),
    otplib = require('otplib'),
    jwt = require('jsonwebtoken'),
    jwtDecode = require('jwt-decode'),
    cors = require('cors'),
    dateFormat = require('dateformat'),
    imageDataURI = require('image-data-uri'),
    cloudinary = require('cloudinary').v2;
var autoIncrement = require('mongoose-auto-increment');
    
var config = require('./config');
//requiring models
var User = require('./models/user');
var Admin = require('./models/admin');
var Order = require("./models/order");
var Address = require("./models/address");
var Category = require("./models/category");
var Cart = require('./models/cart');
var OrderCounter = require("./models/orderCounter");
var Technician = require("./models/technician");
var Product = require('./models/product');
var JwtDevice = require("./models/jwtDevice");
//seed database
var seedDB = require("./seedDb");
var seedOrder = require("./seedOrder");
var seedUser = require("./seedUser");
var seedCategory = require("./seedCategory");
var seedAddress = require("./seedAddress");
var seedTech = require("./seedTech");
//requiring middleware
var middleware = require("./middleware");
//requiring Routes
var productRoutes = require("./routes/product");
var orderRoutes = require("./routes/order");
var categoryRoutes = require("./routes/category");
var userRoutes = require("./routes/user");
var cartRoutes = require("./routes/cart");
var technicianRoutes = require("./routes/technician");

// mongodb://kriti09:rachana123@ds233167.mlab.com:33167/tech-tailor
var mongoDB = 'mongodb://kriti09:rachana123@ds233167.mlab.com:33167/tech-tailor';

// mongoose.connect("mongodb://localhost:27017/tech-tailor",{ useNewUrlParser: true});
// var connection = mongoose.createConnection("mongodb://localhost/myDatabase");
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(cors());
app.set('superSecret', config.secret);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));


otplib.authenticator.options = {
    step: 2000
};

// var newcounter = {
//     _id : "order_id",
//     seq_val : 0,
// };
// OrderCounter.create(newcounter).then(()=>{console.log("done")});

// var otp_secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLE';

app.use("/", productRoutes);
app.use("/category", categoryRoutes);
app.use("/",orderRoutes);
app.use("/user/", userRoutes);
app.use("/cart",cartRoutes);
app.use("/technician",technicianRoutes);

app.get('/generate_otp/:no', (req,res)=>{
    var otp_secret = otplib.authenticator.generateSecret();
    var phone_no = req.params.no;
    const token = otplib.authenticator.generate(otp_secret);
    res.json({success: true, token: token,otp_secret : otp_secret});
});

app.post('/signup/verify_otp', (req,res)=>{  
    var otp_secret = req.query.otp_secret;  
    var user_token = req.query.token;
    var device_id = req.query.device_id;
    var new_user = {
        name: req.query.name,
        password: req.query.password,
        email: req.query.email,
        phone_no: req.query.phone_no,
        role: 'customer',
    };
    if(otplib.authenticator.check(user_token, otp_secret)){
        // res.json({success: true, message: "OTP matched!"});
        User.create(new_user).then((user)=>{
            res.json(generateNewJWT(user, device_id));
        })
    }
    else
        res.json({success: false, message: "authentication failed."});
});
app.post('/login/verify_otp', (req, res)=>{
    var otp_secret = req.query.otp_secret;
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
                JwtDevice.findOne({device_id : device_id , user_id: user._id}).exec().then((result)=>{
                   if(result!=null){
                        res.json({success: true, message: "welcome back "+ user.name, user_id: user._id});
                   }else{
                        res.json(generateNewJWT(user, device_id));
                   }
                });
                
                //generate new token with encoded device id and push it into jwtToken param in User
                
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
    User.findOne({'phone_no': phone_no}).then((user)=>{
        if(user==null)
            res.status(404).json({success: false, message: "User does no exixts"});
        res.redirect("/generate_otp/"+phone_no);
    }).catch((e) => {
        res.status(404).json({success: false, message: "User does no exixts"});
    })
});

app.put('/admin-login', (req, res) => {
    var username = req.body.username;
    var password  = req.body.password;
    // console.log("request for admin login");
    Admin.findOne({'username' : username, 'password': password}).then((user)=>{
        if(user == null)
            res.status(404).json({success: false, message: "Invalid username or Password"});
        else{
            if(user.jwtToken[0] != null)
                res.status(200).json({success: true,message: "welcome back "+user.username, token:user.jwtToken[0] })
            else{
                const payload = {
                    username: user.username,
                    role: 'admin'
                };
                var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: '240h' //  
                });
                // console.log(token);
                user.jwtToken.push(token);
                user.save(()=>{
                    // console.log("token saved");
                    // console.log(user.jwtToken[0]);
                    res.status(201).json({success:true, message:"new token generated",token: token });
                });
                // console.log(token);
                
            }
        }
    }).catch(()=>{})
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
    var newToken = {
        jwt: token,
        device_id: device_id,
        user_id: user._id
    }
    user.save();
    // console.log(token);
    JwtDevice.create((newToken), ()=>{})
    
        return ({
            success: true,
            message: 'token generated',
            user_id: user._id,
        });
    //return the info including token as json
}

app.listen( process.env.PORT || 8080  , () => {
    console.log("Server Connected");
})