/*

app.get('/qrcode') : main.pug
app.post('/qrcode') : qrcode 생성
   params:{
       data: ...
   }
app.get('/qrcode/:id') : view.pug
app.put('/qrcode/:id')
app.delete('/qrcode/:id')

DB 저장 안함, 우선 URL에 대한 QR코드 생성만 시행.

*/


const express = require('express');
const app = express();
const path = require('path');
const QRCode = require('qr-image');
const iconvLite = require('iconv-lite');

if (app.get('env') === 'development')
    app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

app.use('/qrcode/static',express.static(path.join(__dirname, 'public')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded


const getDownloadFilename = (req, filename) => {
    const header = req.headers['user-agent'];

    if (header.includes("MSIE") || header.includes("Trident")) {
        return encodeURIComponent(filename).replace(/\\+/gi, "%20");
    } else {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    }

    return filename;
}

app.post('/qrcode/download', (req, res) => {
    const source = req.body.source;

    const png_object = QRCode.image(source, {type: 'png'});
    const filename = getDownloadFilename(req, source + '.png');
    // console.log(filename);
    // res.setHeader('Content-type', 'image/png');  //sent qr image to client side
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    png_object.pipe(res);
});

app.get('/qrcode/', (req, res) => {
    res.render('main');
});

app.get('/qrcode/view', (req, res) => {
    const source = req.query.source;
    if (source) {

    } else {
        // res.redirect('/qrcode');
    }
    const svg_object = QRCode.imageSync(source, {type: 'svg'});
    res.render('view', {svg_data: svg_object, source: source});
});

app.listen(3000, () => {
    console.log('Connected 3000 port!');
});