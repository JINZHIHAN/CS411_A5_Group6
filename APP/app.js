const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const unirest = require('unirest');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const BASE_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate';
const RAPID_API_KEY = '14c1b8490bmsh6f286e1a513ef6dp1942a9jsn8f2e2db3c858';
const FITBIT_URL_AUTH = 'https://www.fitbit.com/oauth2/authorize';
// configure Express
const app = express();


//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true }, () => {
    console.log('connected to mongodb');
});
//set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

//app.set('views', __dirname + '/views');
app.engine('html', consolidate.swig);
//set view engine
app.set('view engine', 'ejs');
app.use(cookieSession({
    //day in ms
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
//set up cookies with passport
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//this is our server
app.get('/', (req, res) => {
    res.render('home', {user:req.user});
});

app.get('/generate', (req,res) => {
    //make the API calls here
   // res.send('made it to meal planner');
    //userId is the fitbit Id that we sent to mongoDB (cant get because we cant send users to DB)
    //format the date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    unirest.get('https://api.fitbit.com/1/user/'+ userId + '/activities/date/' + (today) + '.json')
        .end((result) => {
        const calories = result.body.summary.caloriesOut
        unirest.get(BASE_URL + '?timeFrame=day&targetCalories=' + calories)
            .header('X-RapidAPI-Key', RAPID_API_KEY)
            .end((result) => {
                console.log(result.headers, result.body);
                res.render('search.html', {
                    results: JSON.stringify(result.body, null, 2),
                });
            });

        //make meanplan generator API call here
        //calories out is result.body.summary.caloriesOut
    });
});
app.post('/', (req, res) => {
    const calories = req.body.calorie_input;

    unirest.get(BASE_URL + '?timeFrame=day&targetCalories=' + calories)
        .header('X-RapidAPI-Key', RAPID_API_KEY)
        .end((result) => {
            console.log(result.headers, result.body);
            res.render('search.html', {
                results: JSON.stringify(result.body, null, 2),
            });
        });
});

//mock the first unirest.get, second .get needs to be in the fitbit.end
//do result.body.keys
//type in phone number to app?
//first time = oAuth from fitbit
//then from then on use phone number as unique for MongoDB
//When go on app, enter phone number, database lookup if oAuth token.  If there is, use fitbit API with token, feed into next call.
//If not one, make a different call to give me an oAuth token
//if expired, use special code

app.listen(6969, () => {
    console.log('App listening on port 6969!');
    console.log('Navigate to http://localhost:6969');
    // get the url


});

