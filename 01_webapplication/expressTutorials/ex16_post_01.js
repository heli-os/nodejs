const express = require('express');
const app = express();

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/form',(req,res)=>{
   res.render('form');
});

app.get('/form_receiver',(req,res)=>{
   // res.send('Hello, GET');
   const title = req.query.title;
   const description = req.query.description;
   res.send(title+','+description);
});

app.post('/form_receiver',(req,res)=>{
    // res.send('Hello, POST');
    const title = req.body.title;
    const description = req.body.description;
    res.send(title+','+description);
});

app.listen(3000,()=>{
   console.log('connected 3000 port!');
});