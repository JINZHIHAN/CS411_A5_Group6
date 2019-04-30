const router = require('express').Router();
const authCheck = (req,res,next)=>{
    if(!req.user){
        //executes if user is not logged in
        res.redirect('/auth/login');
    } else{
        //logged in
        next();
    }
};

router.get('/', authCheck, (req,res)=>{
    //profile view
    //make fitbit/mealplan linked api call here
    res.render('profile', {user:req.user});
});

module.exports = router;