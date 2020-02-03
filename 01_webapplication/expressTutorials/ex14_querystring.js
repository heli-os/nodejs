const express = require('express');
const app = express();

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));

app.get('/topic',(req, res)=>{
    const topics = [
        'Javascript is...',
        'Nodejs is...',
        'Express is...'
    ];
    const as = `
        <a href="/topic?id=0">Javascript</a><br>
        <a href="/topic?id=1">Nodejs</a><br>
        <a href="/topic?id=2">Express</a><br><br>
        ${topics[req.query.id]}
    `;
    res.send(as);
    // res.send(req.query.id+','+req.query.name);
});

app.listen(3000,()=>{
    console.log('Connected 3000 port !');
});