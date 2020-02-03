const express = require('express');
const app = express();
const request = require('request');


app.get('/whois', (req, res) => {
    const url = "https://www.hosting.kr/servlet/popupSvl?cmd=WHOIS_POPUP&text=fluffyllama.com&whois_type=";

    request(url, function(error, response, body){
        res.send(body);
    });
});

app.listen(3001, () => {
    console.log('Connected 3001 port!!!');
});