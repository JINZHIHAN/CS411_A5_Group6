const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const unirest = require('unirest');

const BASE_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate';
const RAPID_API_KEY = '14c1b8490bmsh6f286e1a513ef6dp1942a9jsn8f2e2db3c858';

// configure Express
const app = express();
app.set('views', __dirname + '/views');
app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('search.html');
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

app.listen(6969, () => {
    console.log('App listening on port 6969!');
    console.log('Navigate to http://localhost:6969');
});
