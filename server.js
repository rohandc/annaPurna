//Dependencies Start
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const app=express();
const userRoute= require('./server/_routes/user');
const flyer= require('./server/_routes/flyer');
const cors = require('cors');

//Dependencies End

//File imports Start
const User = require('./server/_models/user');
const config = require('./server/_config');
//File imports End

//Config Start


const originsWhitelist = ['http://localhost:4200'];
const corsOptions = {
  origin: function(origin, callback){
    const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials:true
};

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '250mb'}));
app.use(bodyParser.urlencoded({limit: '250mb', extended: true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'dist')));
//mongoose.set('debug', true);
mongoose.connect(config.database);
process.env.SECRET_KEY="TestSecretKey";
//Config End

//Routes Start

// more specific
app.use('/user', userRoute);

app.use('/flyer',flyer);

//less specific
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});


//Routes End

//Setup Port Start
const port = process.env.PORT || '3000';
app.set('port', port);
app.listen(port, () => console.log(`Running on localhost:${port}`));
//Setup Port End
