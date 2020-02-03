const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'FluffyLlama',
    resave: false,
    saveUninitialized: true
}));

app.get('/count', (req, res) => {
    if(req.session.count)
        req.session.count++;
    else
        req.session.count = 1;
    res.send('result : ' + req.session.count);
});

app.listen(3001, () => {
    console.log('3001 Port Connected!');
});