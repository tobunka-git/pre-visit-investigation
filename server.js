// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var User = require('./app/models/user');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// deal with CORS issue
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI); //connect to the database

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    console.log('Something is happening');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'This is obtained from the API.' });   
});

// more routes for our API will happen here
router.route('/users/sid/:support_id')
  .get(function (req, res) {
       User.findOne( {'support_id' : req.params.support_id }, "support_id", function (err, user) {
            if(err)
                res.send(err);
         
            res.json({'support_id': user.support_id});
       });
   });

router.route('/users/:user_id')
    .get(function (req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if(err)
                res.send(err);

            res.json(user);
        });
    })

    .put(function (req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if(err)
                res.send(err);
            
            user.name = req.body.name;

            user.save(function (err) {
                if(err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            })
        });
    })

    .delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if(err)
                res.send(err);

            res.json({ message: 'User deleted' });
        })
    });

router.route('/users')
    .post(function (req, res) {
        var user = new User();
        user.name = req.body.name;
        user.support_id = req.body.id;
        user.gender = req.body.gender;
        user.position = req.body.position;
        user.company = req.body.company;
        user.country = req.body.country;
        user.domain = req.body.domain;
        user.opinion = req.body.opinion;

        user.save(function(err) {
            if (err) 
                res.json({ errmsg: err });
            
            res.json({ message: 'User created!' });
        });
    })

    .get(function(req,res) {
        User.find(function(err, users) {
            if(err)
                res.send(err);

            res.json(users);
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);