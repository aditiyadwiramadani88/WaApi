const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes');
require('dotenv/config');
const app = express();
app.use(bodyParser.json());
app.use(userRoutes);
app.listen(3000, () => {
    console.log('Running on http://127.0.0.1:3000');
});
