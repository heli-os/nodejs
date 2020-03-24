const fs = require('fs');
const https = require('https');

// key define
const optionsForHTTPS = {
    key: fs.readFileSync('/etc/letsencrypt/live/jupiterflow.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/jupiterflow.com/cert.pem')
};

const express = require('express');
const app = express();

app.set('view engine','pug');
app.set('views','view');

app.get('/view', (req,res)=>{
    res.render('view');
});

app.get('/add',(req,res)=>{
   res.render('add');
});

https.createServer(optionsForHTTPS, app).listen(3001);