const express = require('express');
const crypto = require('crypto-js')
const bodyParser = require('body-parser');

const keyString = process.env.KEY;
const ivString = process.env.IV;

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/get_hash', (req, res) => {
    let params = req.body;
    let response = {};

    for (const [key, value] of Object.entries(params)) {
        if (value != null) {
            response[key + 'Hash'] = getEncrypted(value.toString());
            response[key] = value;
        }
    }

    res.json(response)
});

app.listen(port, () => console.log(`Running on port ${port}`));

function getEncrypted(value) {
    const key = crypto.enc.Base64.parse(keyString);
    const iv = crypto.enc.Base64.parse(ivString);

    let encrypted = crypto.AES.encrypt(value, key, {
        iv: iv,
        padding: crypto.pad.Pkcs7,
        mode: crypto.mode.CBC
    });

    return crypto.enc.Base64.stringify(encrypted.ciphertext);
}
