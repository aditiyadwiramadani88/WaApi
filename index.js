const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes');
require('dotenv/config');
const { Device, User } = require('./models');
const { HandleWhastApp } = require('./utils/whatsAppHandler/connectionWa');
const app = express();
app.use(bodyParser.json());
app.use(userRoutes);
app.listen(3000, async () => {
    // recornnect to whatsApp 
    const findAllDevice = await Device.findAll({ where: { status: 1 } })
    findAllDevice.forEach(async (data) => {
        const dataValues = data.dataValues
        const halder = new HandleWhastApp(dataValues.id)
        await halder.connect()
    })
    console.log('Running on http://127.0.0.1:3000');
});
