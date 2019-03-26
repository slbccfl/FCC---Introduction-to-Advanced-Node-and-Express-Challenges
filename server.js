'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const session     = require('express-session');
const passport    = require('passport');
const mongodb     = require('mongodb');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

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
    res.render(process.cwd() + '/views/pug/index', {title: 'Hello', message: 'Please login'});
  });

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


mongo.connect(process.env.DATABASE, (err, db) => {
    if(err) {
        console.log('Database error: ' + err);
    } else {
      console.log('Successful database connection');

        //serialization and app.listen
      
      passport.deserializeUser((id, done) => {
        db.collection('users').findOne(
          {_id: new ObjectID(id)},
          (err, doc) => {
              done(null, doc);
          }
        );
      });
      
      passport.serializeUser((user, done) => {
        done(null, user._id);
      });
      
      app.listen(process.env.PORT || 3000, () => {
        console.log("Listening on port " + process.env.PORT);
      });
    }
});


