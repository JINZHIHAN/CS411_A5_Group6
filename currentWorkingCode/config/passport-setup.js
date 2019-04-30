const passport = require('passport');
var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

//put user id into cookie, send to browser
passport.serializeUser((user, done)=> {
    done(null, user.id);
});

//find user from id from cookie
passport.deserializeUser((id, done)=> {
    User.findById(id).then((user)=>{
        done(null, user.id);
    });
});

passport.use(
    new FitbitStrategy({
        //options for fitbit strat
        callbackURL: 'auth/fitbit/redirect',
        clientID: keys.fitbit.clientID,
        clientSecret: keys.fitbit.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //check if user already exists in database
        User.findOne({fitbitId: profile.id}).then( (currentUser) => {
            if(currentUser){
                //already have user
                console.log('user is:', currentUser);
                done(null, currentUser);

            } else {
                //create new user in DB
                new User({
                    username: profile.displayName,
                    fitbitId: profile.id
                }).save().then((newUser) => {
                    console.log('new user created:' + newUser);
                   done(null, newUser);
                });
            }
        });
       // console.log('passport callback function fired');
        //console.log(profile);
        new User({
            username: profile.displayName,
            fitbitId: profile.id
        }).save().then((newUser) => {
            console.log('new user created:' + newUser);
        })
    })
);

