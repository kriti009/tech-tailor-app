var middlewareObj = {};
// var Campground = require("../models/campground");
// var Comment = require("../models/comment");

middlewareObj.verifyToken = function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token , app.get("superSecret"), (err,decoded)=>{
            if(err)
                return res.status(403).json({success: false, message: "failed to authenticate token."});
            else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        return res.status(403).json({
            success: false,
            message: "NO token provided",
        });
    }
};

// middlewareObj.checkCampgroundOwnership = function(req, res, next){
//    //is user logged in
//    if(req.isAuthenticated()){
//       Campground.findById(req.params.id, function(err, foundCampground){
//          if(err){
//             req.flash("error", "Campground Not Found");
//             res.redirect("back");
//          }else{
//             // does user own the campground
// // if cannot be used as foundCampground.author.id is a mongoose object and req.user._id is a string
//             if(foundCampground.author.id.equals(req.user._id)){
//                next();
//             }else{
//                 req.flash("error", "You Don't have permission to do that");
//                res.redirect("back");
//             }
//          }
//       });   
//    }else{
//       req.flash("error", "You need to be logged in to do that");
//       res.redirect("back");
//    }
// };
  
// middlewareObj.checkCommentOwnership = function(req, res, next){
//    //user is logged in
//    if(req.isAuthenticated()){
//       Comment.findById(req.params.comment_id, function(err, foundComment){
//          if(err){
//              req.flash("error", "Comment not found");
//             res.redirect("back");
//          }else{
//             //comment belongs to that user
//             if(foundComment.author.id.equals(req.user.id)){
//                next();
//             }else{
//                 req.flash("error", "You don't have permission to do that");
//                res.redirect("back");
//             }
//          }
//       })
//    }else{
//        req.flash("error", "You need to be logged in to do that");
//       res.redirect("back");
//    }
// };

middlewareObj.isLoggedIn = function(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }else{
      res.redirect("/admin-login");
   };
}; 




module.exports = middlewareObj;