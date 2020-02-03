const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser('FluffyLlama-Server_cookie_salt'));

app.get('/count', (req, res) => {
    let count = 0;
    if (req.signedCookies.count)
        count = parseInt(req.signedCookies.count);

    count++;
    res.cookie('count', count,{signed: true});
    res.send('count : ' + count);
});

app.listen(3001, () => {
    console.log('Connected 3001 port!!!');
});