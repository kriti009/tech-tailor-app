var express = require("express");
var Technician = require("../models/technician");
var router = express.Router();

router.get('/',(req, res)=>{
    Technician.find({}).then((result)=>{
        res.status('200').json(result);
    }).catch(()=>{
        res.status('400').json({success:false, message: "internal Error"});
    })
})
router.delete('/', (req, res)=>{
    Technician.findByIdAndDelete(req.body._id).then(()=>{
        res.status(200).json({success: true, message:"Technician Removed succesfully"});
    }).catch(()=>{
        res.status(400).json({success: false, message: "Internal error, Can't Delete this item"})
    })
})
router.post('/', (req, res)=>{
    var data = {
        name: req.body.name,
        address: req.body.address,
        phone_no : req.body.phone_no,
        id_number : req.body.id_number,
        id_photo: req.body.id_photo,
    }
    if(req.body.email!=null || req.body.email!=undefined)
        data.email =  req.body.email;
    Technician.create(data).then((result)=>{
        res.status(200).json({success: true, message: "new Added", technician_id: result._id});
    }).catch(()=>{
        res.status(400).json({success: false, message:"Internal error, could not add"})
    })
})
router.put('/', (req, res)=>{
    var data = {
        name: req.body.name,
        address: req.body.address,
        phone_no : req.body.phone_no,
        id_number : req.body.id_number,
        id_photo: req.body.id_photo
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
});

module.exports = router ; 