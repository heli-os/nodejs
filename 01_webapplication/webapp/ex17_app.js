const express = require('express');
const fs = require('fs');
const app = express();

if (app.get('env') === 'development')
    app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded


app.get(['/topic', '/topic/new', '/topic/view/:title'], (req, res) => {
    fs.readdir('data/', (err, files) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        const title = req.params.title;
        if (title) {
            // title 값이 있을 때
            fs.readFile('data/' + title, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                res.render('view', {topics: files, title: title, description: data});
            });
        } else {
            // title 값이 없을 때
            if(req.path === '/topic/new') // '/topic/new'로 접근했을 때
                res.render('new', {topics:files});
            else // '/topic/view/:title'로 접근했을 때
                res.render('view', {topics: files, title: 'Welcome', description: 'Hello, JavaScript for server'});
        }
    });
});

app.post('/topic', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    fs.writeFile('data/' + title, description, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/view/'+title);
    });
});

app.listen(3001, () => {
    console.log('Connected, 3001 port!');
});