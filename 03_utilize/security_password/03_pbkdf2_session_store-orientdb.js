const express = require('express');
const session = require('express-session');
const OrientoStore = require('connect-oriento')(session);
const db_config = require('../../secure-configure.json').db_config;
const bkfd2Password = require("pbkdf2-password");

const app = express();
const hasher = bkfd2Password();


app.use(session({
    store: new OrientoStore({
        server: 'host=' + db_config.host + '&port=2424&username=' + db_config.username + '&password=' + db_config.password + '&db=' + db_config.database
    }),
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
const users = [
    {
        username: 'keriel',
        password: 'PG18ntswyds6AaUKFKMOArN0hygMKInno/PJKDp4CRx0FpDWD7IZLsZ3XAFAKYjnJX+k/ujlZ4JB/OEyhamYS47EbIChZ1pL0Z/AaofzYFHuAuqiIqfDq5Z2uscX2v+B2gNgiNm82drAfpcxmTGiEEWX7k+UK2W9Md0SglXrAwY=',
        salt: '3crVwh7UsmiIxMP4HNkUb3Q1r6pc+5BqMHs37TMcg3yQ4cRosTv2D1tjfnjBi+oq69/kV4+82j7vZqZnYA/UpA==',
        displayName: 'Mr.Keriel'
    }
];

app.post('/auth/login', (req, res) => {
    const uname = req.body.username;
    const pwd = req.body.password;

    for (let i = 0; i < users.length; i++) {
        let user = users[i];

        if (uname === user.username) {
            return hasher({password: pwd, salt: user.salt}, (err, pass, salt, hash) => {
                if (hash === user.password) {
                    req.session.displayName = user.displayName;
                    return req.session.save(() => {
                        res.redirect('/welcome');
                    });
                } else {
                    res.send('Who are you? Check your password <a href="/auth/login">Login</a>');
                }
            });
        }

        // if (uname === user.username && sha256(pwd+user.salt) === user.password) {
        //     req.session.displayName = user.displayName;
        //     return req.session.save(() => {
        //         res.redirect('/welcome');
        //     });
        // }
    }
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
    req.session.save(() => {
        res.redirect('/Welcome');
    });
});

app.listen(3001, () => {
    console.log('3001 Port Connected!');
});