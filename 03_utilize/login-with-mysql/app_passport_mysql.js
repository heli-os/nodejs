const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bkfd2Password = require("pbkdf2-password");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const hasher = bkfd2Password();
const mysql = require('mysql');

const MySQLSetting = require('./secure-configure.json').MySQL;
const FacebookStrategySetting = require('./secure-configure.json').Facebook;

const conn = mysql.createConnection({
    host: MySQLSetting.host,
    user: MySQLSetting.user,
    password: MySQLSetting.password,
    database: MySQLSetting.database
});

const fs = require('fs');
const https = require('https');

// key define
const optionsForHTTPS = {
    key: fs.readFileSync('/etc/letsencrypt/live/jupiterflow.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/jupiterflow.com/cert.pem')
};


const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded


app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(MySQLSetting)
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/count', (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});
app.get('/auth/logout', (req, res) => {
    req.logout();
    req.session.save(() => {
        res.redirect('/welcome');
    });
});
app.get('/welcome', (req, res) => {
    if (req.user && req.user.displayName) {
        res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
    } else {
        res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
    }
});

passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
    done(null, user.authId);
});

passport.deserializeUser((id, done) => {
    console.log('deserializeUser', id);
    const sql = 'SELECT * FROM users WHERE authId=?';

    conn.query(sql, [id], (err, results) => {
        if (err || !results[0]) {
            console.log(err);
            done('There is no user');
        } else {
            return done(null, results[0]);
        }
    });
});

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    (username, password, done) => {
        const uname = username;
        const pwd = password;

        const sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, ['local:' + uname], (err, results) => {
            if (err || !results[0]) {
                done('There is no user.');
            } else {
                const user = results[0];
                return hasher({password: pwd, salt: user.salt}, (err, pass, salt, hash) => {
                    if (hash === user.password) {
                        console.log('LocalStrategy', user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            }
        });
    }
));
app.post('/auth/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false
        }
    )
);

app.post('/auth/register', (req, res) => {
    hasher({password: req.body.password}, (err, pass, salt, hash) => {
        const user = {
            authId: 'local:' + req.body.username,
            username: req.body.username,
            password: hash,
            salt: salt,
            displayName: req.body.displayName
        };
        const sql = 'INSERT INTO users SET ?';
        conn.query(sql, user, (err, results) => {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                req.login(user, (err) => {
                    req.session.save(() => {
                        res.redirect('/welcome');
                    });
                });
            }
        });

    });
});


passport.use(new FacebookStrategy({
        clientID: FacebookStrategySetting.clientID,
        clientSecret: FacebookStrategySetting.clientSecret,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const authId = 'facebook:' + profile.id;
        const sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], (err, results) => {
            if (results.length > 0) {
                done(null, results[0]);
            } else {
                const newUser = {
                    'authId': authId,
                    'displayName': profile.displayName,
                    'email': profile.emails[0].value
                };
                const sql = 'INSERT INTO users SET ?';
                conn.query(sql, newUser, (err, results) => {
                    if (err) {
                        console.log(err);
                        done('Error');
                    } else {
                        done(null, newUser);
                    }
                });
            }
        });
    }
));

app.get('/auth/facebook',
    passport.authenticate(
        'facebook',
        {
            scope: ['email']
        }
    )
);

app.get('/auth/facebook/callback',
    passport.authenticate(
        'facebook',
        {
            failureRedirect: '/auth/login'
        }
    ), (req, res) => {
        req.session.save(() => {
            res.redirect('/welcome');
        });
    }
);

app.get('/auth/register', (req, res) => {
    const output = `
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
    res.send(output);
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
  <a href="/auth/facebook">facebook</a>
  `;
    res.send(output);
});

https.createServer(optionsForHTTPS, app).listen(3001);