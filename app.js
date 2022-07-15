const express = require('express');
const createHttpError = require('http-errors');
const ShortId = require('shortid');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connectdb=require('./config/db');
connectdb();

const Quiz = require('./models/quiz');

app.use('/',require('./config/passport'));


app.listen(process.env.PORT || 9999,function(){
    console.log("➡️ APP is listening on port %d in %s mode 👍",  this.address().port, app.settings.env);
})

app.get('/',(req,res,next)=>{
    res.render('index',{
        value : "Login Page"
    });
})

app.get('/logout',(req,res)=>{
    req.logOut(false,(err)=>{
        if(err)
        console.log(err.message);
    });
    // req.session.destroy();
    res.render('index',{
        value : "Sucessful Logout / Login again"
    });
})


app.get('/test',(req,res,next)=>{
    res.render('dashboard');
})

app.post('/create-form', async (req, res, next) => {
    try {
        var quizJsonData = JSON.stringify(req.body);
        var shortId = ShortId.generate();
        const quiz = new Quiz({ shortId , quizJsonData})
        const result = await quiz.save();
        var preview = `/quiz/${result.shortId}`;
        res.redirect(preview);
    } catch (error){
        next(error);
    }
})

app.get('/quiz/:shortId', async (req, res, next) => {
    try {
      const { shortId } = req.params
      const result = await Quiz.findOne({ shortId })
      if (!result) {
        throw createHttpError.NotFound('Quiz url does not exist.')
      }
      res.render('quiz',{jsonData: result.quizJsonData});
    } catch (error) {
      next(error)
    }
  })

  app.use((req, res, next) => {
    next(createHttpError.NotFound())
  })
  
app.use((err, req, res, next) => {
    res.render('error')
    res.status(err.status || 500)
  })