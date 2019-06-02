const express = require('express');

let public_dir = 'startbootstrap-sb-admin-gh-pages';

const app = express();
app.use(express.static(public_dir));

app.listen(3000,() => {
    console.log('Server Started');
});
