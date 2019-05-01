const router = require('express').Router();
const passport = require('passport');
//auth login
router.get('/login', (req, res) => {
  res.render('login', {user: req.user});
});
//auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//auth with fitbit
router.get('/fitbit', passport.authenticate('fitbit',{
    scope: ['profile']

}));

//callback rout for google to redirect to
router.get('/fitbit/redirect', passport.authenticate('fitbit'),(req,res)=>{
    //res.send('callback URI');
    res.redirect('/profile/');
});



module.exports = router;