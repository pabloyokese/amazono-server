const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');

const app = express();

mongoose.connect(config.database, (err) => {
    if (err) {
        consoe.log(err);
    } else {
        console.log('connect to database');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(cors());

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');
const productSearchRoutes = require('./routes/product-search');

app.use('/api/',mainRoutes);
app.use('/api/accounts',userRoutes);
app.use('/api/seller',sellerRoutes);
app.use('/api/search',productSearchRoutes);

app.listen(config.port, (err) => {
    console.log('magic happens on port ' + config.port);
});