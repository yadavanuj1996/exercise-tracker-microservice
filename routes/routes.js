var express=require('express');
var api=express();
var mongoose=require('mongoose');
var User=require('../models/user');
var Exercise=require('../models/exercise');
var changeDateFormat=require('../utils/change-date-format').changeDateFormat;
var changeObjectArrayDateFormat=require('../utils/change-date-format').changeObjectArrayDateFormat;


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true ,useUnifiedTopology: true,useCreateIndex: true});

api.post('/exercise/new-user',(req,res,next)=>{
  let userName=new User({username: req.body.username});
  userName.save((err,data)=>{
    if(err){
      return next(new Error("sername already taken"));
    }

    let result={username: data.username, _id: data._id, };
    res.json(result);
  });
});

api.post('/exercise/add',(req,res,next)=>{
  let userId=req.body.userId;
  let userName=User.findOne((err,data)=>{
    if(err){
      return next(err);
    }
    
    if(req.body.date===''){
      req.body.date=new Date();
    }
    else if(!(/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(req.body.date))){
      return next(new Error("Wrong Date Format"));
    }
    
    let username=data.username;
    let newExerciselog=new Exercise({
      username: username,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date
    }); 

     let formatChangedDate=changeDateFormat(req.body.date);

    newExerciselog.save((err,data)=>{
      if(err){
        return next(err);
      }
      let result={
        "username": data.username,"description":data.description,
        "duration":data.duration,
        "_id": req.body.userId,
        "date": formatChangedDate
      };
      res.json(result);
    });

  });
  
    
  });

api.get('/exercise/log',(req,res,next)=>{
  let limit=99999999;
  var ObjectId = mongoose.Types.ObjectId; 
  let userObjectId=new ObjectId(req.query.userId);
  
  User.findOne({_id: userObjectId},(err,data)=>{
    if(err){
      return next(err);
    }
    
    let username=data.username;
    let findQueryObject={username: username};

  if(req.query.limit !== undefined){
    limit=parseInt(req.query.limit);
  }
  else if(req.query.from !== undefined && req.query.to !== undefined){
    findQueryObject={username: username,date: { $gte: req.query.from, $lte: req.query.to }};
  }

    Exercise.find(findQueryObject).select({"_id":0,"__v":0}).limit(limit).exec((err,data)=>{
    if(err){
      return next(err);
    }
    let resultData=changeObjectArrayDateFormat(data);
   // console.log(resultData);
    res.json({_id:req.query.userId, username: username, count: resultData.length, log: resultData});
    });
  });
});


api.get('/exercise/users',(req,res,next)=>{
  User.find({},(err,data)=>{
    if(err){
      return next(err);
    }
    res.json(data);
  });
});

module.exports=api;