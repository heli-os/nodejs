const express = require('express');
const app = express();

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static('public'));

app.get('/template',(req, res)=>{
   res.render('temp',{ _title: 'Pug', time: Date() });
});

app.get('/', (req, res)=>{
    res.send('Hello World!');
});

app.get('/dynamic',(req,res)=>{
    let lis = '';
    for(let i=0;i<10;i++){
        lis += '<li>coding'+(i+1)+'</li>';
    }
    const time = Date();
    const output = `<!doctype html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
                <title>Document</title>
        </head>
        <body>
            Hello, Dynamic!
            <ul>
                ${lis}
            </ul>           
            ${time} 
        </body>
        </html>`
    res.send(output);
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