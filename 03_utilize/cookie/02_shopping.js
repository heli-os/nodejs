const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser('FluffyLlama-Server_cookie_salt'));

const products = {
    1: {title: 'The history of web 1'},
    2: {title: 'The next web'}
};
app.get('/products', (req, res) => {
    let output = '';
    for (const name in products) {
        output +=
            `<li>
                <a href="/cart/${name}">${products[name].title}</a>
            </li>`;
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart/">Cart</a>`);
});

/*
제품id:수량
cart = {
    1:2,
    2:1
}
 */
app.get('/cart/:id', (req, res) => {
    const id = req.params.id;
    let cart;
    if (req.signedCookies.cart) {
        cart = req.signedCookies.cart;
    } else {
        cart = {};
    }
    if (!cart[id])
        cart[id] = 0;
    cart[id] = parseInt(cart[id]) + 1;
    res.cookie('cart', cart, {signed: true});
    res.redirect('/cart');
});

app.get('/cart', (req, res) => {
    const cart = req.signedCookies.cart;
    let output = '';
    if (!cart) {
        res.send('Empty!');
    } else {
        for (const id in cart) {
            output += `<li>${products[id].title} (${cart[id]})</li>`;
        }
    }
    res.send(`
        <h1>Cart</h1>
        <ul>${output}</ul>
        <a href="/products">Products List</a>
    `);
});

app.listen(3001, () => {
    console.log('Connected 3001 port!!!');
});