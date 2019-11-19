var express=require('express')
var app=express();
var port=3000 || process.env.PORT;
var cors=require('cors');
var path=require('path');
var bodyParser=require('body-parser');
var api=require('./routes/routes');

app.use(cors());


//mongoose.connect(process.env.MONGO_URI);
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res,next)=>{
  res.sendFile(path.join(__dirname,'views','index.html'));
});

app.use('/api',api);

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})


app.listen(port,()=>{
  console.log("Server started at port: "+port);
});