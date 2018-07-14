const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
//connect to db
//important line for connecting - "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe"
mongoose.connect("mongodb://localhost/transactions");

//mongoose.connect("mongodb+srv://node-rest-shop:"+process.env.MONGO_ATLAS_PW+"@node-rest-shop-usfax.mongodb.net/test?retryWrites=true");
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
//makes the static folder public
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//how to handle CORS errors
app.use((req, res, next)=>{
    //on this header, in our project, remove '*' for bridgehealth.org
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method==="OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

        return res.status(200).json({})
    }

    next();

});

//Routes to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//Error handling
app.use((req, res, next)=>{
    const error = new Error("Not found");
    error.status=404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
module.exports = app;