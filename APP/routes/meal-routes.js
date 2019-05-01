const router = require('express').Router();
const authCheck = (req,res,next)=>{
    if(!req.user){
        //executes if user is not logged in
        res.redirect('/fitbit');
    } else{
        //logged in
        next();
    }
};
//TODO: Once logged in, make ApI call to get user calories out, then put into second API call in the .end

router.get('/', authCheck, (req,res)=>{
    //profile view
    //make fitbit/mealplan linked api call here
    res.render('profile', {user:req.user});
});

module.exports = router;