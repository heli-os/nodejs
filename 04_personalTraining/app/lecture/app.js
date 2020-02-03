const express = require('express');
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

// QueryString
app.get('/',(req,res)=>{
    const id = req.query.id;
    const pw = req.query.pw;

    res.send(`${id}<br>${pw}`);
});

// Semantic URL
app.get('/products/:id',(req,res)=>{
    const id = req.params.id

    res.send(`${id}`);
});

// Normal POST
app.post('/',(req,res)=>{
    const id = req.body.id;
    const pw = req.body.pw;
    const code = req.body.code;

    const super_id = 'admin';
    const super_pw = 'admin_pw';
    const super_code = '123456';

    if(super_id===id) {
        if (super_pw === pw) {
            if (super_code === code) {
                res.send("로그인 성공");
            } else
                res.send("코드 확인 바람");
        } else
            res.send("패스워드 확인 바람");
    } else
        res.send("아이디 확인 바람");
});

app.listen(3001,()=>{
    console.log('3001 Port connected');
});