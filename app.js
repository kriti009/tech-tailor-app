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
    imageDataURI = require('image-data-uri');
    
var config = require('./config');
//requiring models
var User = require('./models/user');
var Admin = require('./models/admin');
var Order = require("./models/order");
var Address = require("./models/address");
var Category = require("./models/category");
var Cart = require('./models/cart');
var Technician = require("./models/technician");
var Product = require('./models/product');
var JwtDevice = require("./models/jwtDevice");
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

// mongodb://kriti09:rachana123@ds233167.mlab.com:33167/tech-tailor
var mongoDB = 'mongodb://kriti09:rachana123@ds233167.mlab.com:33167/tech-tailor';
// mongoose.connect("mongodb://localhost:27017/tech-tailor",{ useNewUrlParser: true});
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


// var otp_secret = otplib.authenticator.generateSecret();
const otp_secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';

app.use("/", productRoutes);
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
            res.json(generateNewJWT(user, device_id));
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
                // console.log(user);
                // user.jwtToken.forEach((t)=>{
                //     if(jwtDecode(t).device_id == device_id)
                //         res.json({success: true, message: "welcome back "+ jwtDecode(t).name});
                // });
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



app.get('/get_user_details', (req, res) => {
    User.findById(req.query.user_id).populate("address").then((result)=>{
        if(result==null)
            res.status(400).json({success: false, message: "User not Found"});
        var address = result.address.map((h,i)=>(
            h.area.concat(", ",h.city, ", ",h.state,", ",h.pincode)
        ));
        // result.address.concat(' ', str2)
        res.status(200).json({name: result.name, email: result.email, phone_no: result.phone_no, address :address});
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal error"});
    })
});
app.get("/get_category", (req, res)=> {
    Category.find({} , (err, category) => {    
        res.json(category);
    })    
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
app.get('/get_user_orders', (req,res)=>{
    User.findById(req.query.user_id)
    .populate({path: 'orders', populate: { path: 'pickup_address' }})
    .then((user)=>{
        if(user==null)
            res.status(404).json({success: false, message: "No such user/orders exits"});
        res.status(200).json(user.orders);
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal error"});
    })
});
app.get('/get_order_details', (req, res)=>{
    Order.findById(req.query.order_id).populate('product.product_id').populate('pickup_address').then((order)=>{
        if(order==null)
            res.status(404).json({success: false, message: "No such order exits"});
        var address = order.pickup_address.area.concat(", ",order.pickup_address.city, ", ",order.pickup_address.state,", ",order.pickup_address.pincode);
        // var sentOrder = order;
        // sentOrder.pickup_address= address;
        // console.log(sentOrder);
        // sentOrder.save(()=>{
        //     console.log(sentOrder);
            res.status(200).json(order);
        // });
        
    }).catch()
})
app.get('/get_all_orders' , (req, res)=>{
    Order.find({}).populate('user_id').populate("product.product_id").populate("pickup_address").then((result)=>{
        res.status(200).json(result);    
    });
});
app.post('/place_order', (req, res) => {
    console.log(req.body.pickup_date);
    console.log(dateFormat(req.body.pickup_date, "isoDateTime"));
    var newOrder = {
        product : req.body.product,
        pickup_date : dateFormat(req.body.pickup_date, "isoDateTime"),
        user_id : req.body.user_id,
        // pickup_date: req.body.pickup_date,   
        pickup_address : req.body.pickup_address,
        price: req.body.price,
        status: 'order placed',
    };
    var auditTemplate = {
        status: 'order placed',
        date : Date.now(),
    }
    User.findById(req.body.user_id).then((user)=>{
        if(user==null)
            res.status(404).json({success:false, message:"Wrong user credentials"});
        else{
            Order.create(newOrder, (err, order) => {
                if(err){
                    res.status(400).json({success: false, message: "couldn't place your order"})
                }else{
                    order.audit.push(auditTemplate);
                    user.orders.push(order._id);
                    order.save(()=>{
                        user.save(()=>{
                            res.status(201).json({success: true,message : "new order placed"});
                            console.log("order placed and your order is : ", order._id);
                        })
                        
                    });
                    
                }
            });
        }
    }).catch()
});
app.put('/update_status', (req, res)=>{
    var new_status = req.body.status;
    // console.log(req);
    // console.log(res);
    var auditTemplate = {
        status: new_status,
        date : Date.now(),
        updated_by: req.body.updated_by,
    };
    Order.findById(req.body.order_id).then((result) => {
        result.status = new_status;
        result.audit.push(auditTemplate);
        result.save(()=>{
            console.log("Status upadated");
        });
        res.status(202).json(result);
    });
});
app.put('/assign_technician', (req, res)=>{
    var auditTemplate = {
        status: "technician assigned",
        date : Date.now(),
        updated_by: req.body.updated_by,
        remark: `technician assigned: ${req.body.technician}`,
    };
    Order.findById(req.body.order_id).then((result)=>{
        // console.log(req.body.technician);
        result.technician = req.body.technician;
        result.status = "technician assigned";
        result.audit.push(auditTemplate);
        result.save(()=>{
            console.log("new technician assigned");
            // console.log(result);
        });
        res.status(202).json(result);
    });
});
app.get('/get_address',(req, res)=>{
    var user_id = req.query.user_id;
    User.findById(user_id).populate("address").then((result)=>{
        if(result==null){
            res.status(404).json({success:false, message:"NO such user or address exits"})
        }else{
            res.status(200).json({success:true, address: result.address})
        }
    })
});
app.put('/edit_address', (req, res)=>{
    var edited_address = {
        pincode : req.query.pincode,
        area : req.query.area,
        city: req.query.city,
        state: req.query.state,
        landmark: req.query.landmark,
    };
    if(edited_address.landmark==null){
        edited_address.landmark = "";
    };
    var address_id = req.query.address_id;
    // var user_id = req.query.user_id;
    Address.findByIdAndUpdate(address_id, edited_address).then((result)=>{
        if(result==null)
            res.status(400).json({success: false, message: "error"});
        else
            res.status(200).json({success: true, message:"saved changes"});
    }).catch(()=>{
        res.status(400).json({success: false, message: "internal error"})
    })
});
app.post('/add_new_address', (req,res)=>{
    var new_address = {
        pincode : req.query.pincode,
        area : req.query.area,
        city: req.query.city,
        state: req.query.state,
        landmark: req.query.landmark,
    };
    if(new_address.landmark==null){
        new_address.landmark = "";
    };
    var user_id = req.query.user_id;
    Address.create(new_address).then((address)=>{
        User.findById(user_id).then((user)=>{
            if(user==null)
                res.status(400).json({success: false, message: "internal error"});
            else{
                user.address.push(address._id);
                user.save(()=>{
                    res.status(200).json({success: true, message: "new address added" ,address_id: address._id});
                });
            }
        })
    }).catch(()=>{
        res.status(400).json({success: falses, message: "internal error"});
    })
});
app.post('/add_new_category', (req, res)=>{
    var new_category = {
        name : req.body.name,
        image_url : req.body.image_url,
    };
    Category.create(new_category).then(()=>{
        res.status(200).json({success: true, message: "New Category saved"});
    }).catch(()=>{
        res.status(400).json({success: true, message: "Internal error"});
    })
});

app.get('/technician',(req, res)=>{
    Technician.find({}).then((result)=>{
        res.status('200').json(result);
    }).catch(()=>{
        res.status('400').json({success:false, message: "internal Error"});
    })
})
app.delete('/technician', (req, res)=>{
    Technician.findByIdAndDelete(req.body._id).then(()=>{
        res.status(200).json({success: true, message:"Technician Removed succesfully"});
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal error, Can't Delete this item"})
    })
})
app.post('/technician', (req, res)=>{
    var data = {
        name: req.body.name,
        address: req.body.address,
        phone_no : req.body.phone_no
    }
    if(req.body.email!=null || req.body.email!=undefined)
        data.email =  req.body.email;
    Technician.create(data).then((result)=>{
        res.status(200).json({success: true, message: "new Added", technician_id: result._id});
    }).catch(()=>{
        res.status(400).json({success: false, message:"Internal error, could not add"})
    })
})
app.put('/technician', (req, res)=>{
    var data = {
        name: req.body.name,
        address: req.body.address,
        phone_no : req.body.phone_no
    }
    if(req.body.email!=null || req.body.email!=undefined)
        data.email =  req.body.email;
    Technician.findByIdAndUpdate(req.body._id, data).then((result)=>{
        if(result != null){
            res.status(200).json({success: true, message: " Updated"});
        }
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal Error"});
    })
})

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