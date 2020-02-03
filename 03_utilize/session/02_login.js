const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'FluffyLlama',
    resave: false,
    saveUninitialized: true
}));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

app.get('/welcome', (req, res) => {
    if (req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">logout</a>
        `);
    } else
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a>
        `);
});

app.post('/auth/login', (req, res) => {
    const user = {
        username: 'keriel',
        password: '111',
        displayName: 'Keriel@FluffyLlama.com'
    };

    const uname = req.body.username;
    const pwd = req.body.password;

    if (uname === user.username && pwd === user.password) {
        req.session.displayName = user.displayName;
        res.redirect('/welcome');
    } else
        res.send('Who are you? <a href="/auth/login">Login</a>');
});

app.get('/auth/login', (req, res) => {
    const output = `
        <h1>Login</h1>
        <form action="/auth/login" method="post">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit">  
            </p>
        </form>
    `;

    res.send(output);
});

app.get('/auth/logout', (req, res) => {
    delete req.session.displayName;
    res.redirect('/Welcome');
});

app.listen(3001, () => {
    console.log('3001 Port Connected!');
});