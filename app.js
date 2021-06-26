const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const productRoute = require('./api/route/product');
const userRoute = require('./api/route/user');
const fileUpload = require('express-fileupload');



// mongoDb connection
mongoose.connect('mongodb+srv://sbs:sbs123@sbs.gpk49.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser:true});

mongoose.connection.on('error',err=>{
    console.log('connection failed')
})

mongoose.connection.on('connected',()=>{
    console.log('connected successfully with database')
})

app.use(fileUpload({
  useTempFiles:true
}))

app.use(cors());



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/product',productRoute);
app.use('/user',userRoute);



// error if any one will hit bad url
app.use((req,res,next)=>{
  res.status(404).json({
      Error:'url not found'
  })
})

module.exports = app;
