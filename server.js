'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');

const app = express();

const cors = require('cors');
app.use(cors());

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set 'pug' as the 'view-engine'. 
app.set('view engine', 'pug')

app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/pug/index.pug');
    res.render(process.cwd() + '/views/pug/index', {title: 'Home page', message: 'Please login'});
  });



app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});
