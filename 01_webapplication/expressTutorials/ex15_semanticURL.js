const express = require('express');
const app = express();

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));

app.get('/topic/:id',(req, res)=>{
    const topics = [
        'Javascript is...',
        'Nodejs is...',
        'Express is...'
    ];
    const as = `
        <a href="/topic/0">Javascript</a><br>
        <a href="/topic/1">Nodejs</a><br>
        <a href="/topic/2">Express</a><br><br>
        ${topics[req.params.id]}
    `;
    res.send(as);
});

app.get('/topic/:id/:mode',(req,res)=>{
    res.send(req.params.id+','+req.params.mode);
});

app.listen(3000,()=>{
    console.log('Connected 3000 port !');
});