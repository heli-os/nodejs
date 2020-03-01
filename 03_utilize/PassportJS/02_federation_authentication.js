const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bkfd2Password = require("pbkdf2-password");
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const hasher = bkfd2Password();

const fs = require('fs');
const https = require('https');

// key define
const optionsForHTTPS = {
    key : fs.readFileSync('/etc/letsencrypt/live/jupiterflow.com/privkey.pem'),
    cert : fs.readFileSync('/etc/letsencrypt/live/jupiterflow.com/cert.pem')
};

const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
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
    done(null, user.username);
});

passport.deserializeUser((id, done) => {
    console.log('deserializeUser', id);
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (id === user.username) {
            return done(null, user);
            // req.user 객체 생성
        }
    }
});

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    (username, password, done) => {
        const uname = username;
        const pwd = password;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (uname === user.username) {
                return hasher({password: pwd, salt: user.salt}, (err, pass, salt, hash) => {
                    console.log('LocalStrategy', user);
                    if (hash === user.password) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            }
        }
        done(null, false);
    }
));
passport.use(new FacebookStrategy({
        clientID: '',
        clientSecret: '',
        callbackURL: "/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        // User.findOrCreate(..., function (err, user) {
        //     if (err) {
        //         return done(err);
        //     }
        //     done(null, user);
        // });
    }
));

app.post('/auth/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false
        },
        () => {

        }
    )
);
app.get('/auth/facebook',
    passport.authenticate(
        'facebook',
        {},
        () => {

        }
    )
);
app.get('/auth/facebook/callback',
    passport.authenticate(
        'facebook',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login'
        },
        () => {}
    )
);
const users = [
    {
        username: 'keriel',
        password: 'mTi+/qIi9s5ZFRPDxJLY8yAhlLnWTgYZNXfXlQ32e1u/hZePhlq41NkRfffEV+T92TGTlfxEitFZ98QhzofzFHLneWMWiEekxHD1qMrTH1CWY01NbngaAfgfveJPRivhLxLD1iJajwGmYAXhr69VrN2CWkVD+aS1wKbZd94bcaE=',
        salt: 'O0iC9xqMBUVl3BdO50+JWkpvVcA5g2VNaYTR5Hc45g+/iXy4PzcCI7GJN5h5r3aLxIhgMN8HSh0DhyqwAp8lLw==',
        displayName: 'Mr.Keriel'
    }
];
app.post('/auth/register', (req, res) => {
    hasher({password: req.body.password}, (err, pass, salt, hash) => {
        const user = {
            username: req.body.username,
            password: hash,
            salt: salt,
            displayName: req.body.displayName
        };
        users.push(user);
        req.login(user, (err) => {
            req.session.save(() => {
                res.redirect('/welcome');
            });
        });
    });
});
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
// app.listen(3001, () => {
//     console.log('Connected 3001 port!!!');
// });