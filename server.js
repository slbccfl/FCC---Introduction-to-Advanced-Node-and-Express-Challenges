'use strict';

const routes = require('./routes.js');
const auth = require('./auth.js');
const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const session     = require('express-session');
const mongodb     = require('mongodb');
const mongo = require('mongodb').MongoClient;

const passport    = require('passport');
const bcrypt     = require('bcrypt');

const app = express();

const cors = require('cors');
app.use(cors());

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set 'pug' as the 'view-engine'. 
app.set('view engine', 'pug')

mongo.connect(process.env.DATABASE, (err, db) => {
    if(err) {
        console.log('Database error: ' + err);
    } else {
      console.log('Successful database connection');
      
      auth(app, db)
      routes(app, db)
  
      app.route('/auth/github')
        .get((req, res) => {
          res.redirect(passport.authenticate('github'))
        });

      app.route('/auth/github/callback')
        .get(passport.authenticate('github', { failureRedirect: '/' }),(req,res) => {
             res.redirect('/profile');
        });
      
      app.listen(process.env.PORT || 3000, () => {
          console.log("Listening on port " + process.env.PORT);
        });

    }
});


