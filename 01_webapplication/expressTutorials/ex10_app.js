const express = require('express');
const app = express();
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.send('Hello World!');
});

app.get('/route', (req, res)=>{
   res.send('Hello Router, <img src="/route.gif">');
});
app.get('/login', (req, res)=>{
    res.send('Login please');
});

app.listen(3000, ()=>{
    console.log('Connected 3000 port!');
});