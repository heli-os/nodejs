/*
 * get('topic/') : view.pug
 * get('topic/:id') : view.pug
 * get('topic/add') : add.pug
 *      post('topic/add')
 *      get('topic/:id')
 * get('topic/:id/edit') : edit.pug
 *      post('topic/:id/edit')
 *      get('topic/:id')
 * get('topic/:id/delete') : delete.pug
 *      post('topic/:id/delete')
 *      get('topic/')
 */

const express = require('express');
const OrientDBClient = require("orientjs").OrientDBClient;
const app = express();
const db_config  = require('../../secure-configure.json').db_config;
db_config
let session;

OrientDBClient.connect({
    host: db_config.host,
    port: 2424
}).then(client => {
    client.session({name: db_config.database, username: db_config.username, password: db_config.password})
        .then(_session => {
            session = _session;
        });
});


if (app.get('env') === 'development')
    app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.get('/topic/add', (req, res) => {
    session.select().from('topic')
        .all()
        .then((topics) => {
            res.render('add', {topics: topics});
        });
});
app.post('/topic/add', (req, res) => {
    const title = req.body.title;
    const desc = req.body.description;
    const author = req.body.author;
    session.insert().into('topic')
        .set({
            title: title,
            description: desc,
            author: author
        })
        .one()
        .then((result) => {
            res.redirect('/topic/' + encodeURIComponent(result['@rid']));
        });
});

app.get('/topic/:id/edit', (req, res) => {
    const id = req.params.id;
    session.select().from('topic')
        .all()
        .then((topics) => {
            session.record.get(id).then((topic) => {
                // console.log('Loaded record:', topic);
                res.render('edit', {topics: topics, topic: topic});
            });
        });
});

app.post('/topic/:id/edit', (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const desc = req.body.description;
    const author = req.body.author;
    session.update(id)
        .set({
            title: title,
            description: desc,
            author: author
        })
        .one()
        .then((update) => {
            res.redirect('/topic/' + encodeURIComponent(id));
        });
});


app.get('/topic/:id/delete', (req, res) => {
    const id = req.params.id;
    session.select().from('topic')
        .all()
        .then((topics) => {
            session.record.get(id).then((topic) => {
                // console.log('Loaded record:', topic);
                res.render('delete', {topics: topics, topic: topic});
            });
        });
});

app.post('/topic/:id/delete', (req, res) => {
    const id = req.params.id;
    session.delete().from('topic')
        .where('@rid='+id).limit(1).scalar()
        .then((update) => {
            res.redirect('/topic');
        });
});

app.get(['/topic', '/topic/:id'], (req, res) => {
    session.select().from('topic')
        .all()
        .then((topics) => {
            const id = req.params.id;
            if (id) {
                // id 값이 있을 때
                session.record.get(id).then((topic) => {
                    // console.log(topic);
                    res.render('view', {topics: topics, topic: topic});
                });
            } else {
                // id 값이 없을 때
                res.render('view', {topics: topics});
            }
        });
});


app.listen(3001, () => {
    console.log('Connected, 3001 port!');
});