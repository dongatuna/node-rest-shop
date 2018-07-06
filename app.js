const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//connect to db
mongoose.connect('mongodb://node-rest-shop:'+process.env.MONGO_ATLAS_PW+
'@node-rest-shop-shard-00-00-usfax.mongodb.net:27017,node-rest-shop-shard-00-01-usfax.mongodb.net:27017,node-rest-shop-shard-00-02-usfax.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true',
{ useNewUrlParser: true });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//Error handling
app.use((req, res, next)=>{
    const error = new Error("Not found");
    error.status=404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status||500);

    res.json({
        error: {
            message: error.message
        }
    });          
    
});
module.exports = app;