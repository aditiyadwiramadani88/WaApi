const { Device, User } = require('../models');
const { HandleWhastApp, Qrcode } = require('../utils/whatsAppHandler/connectionWa');
const { sendMessageValidated, sendMediaMessageValidated } = require('../validation/sendMessage');


const sendMessage = async (req, res) => {
    console.log(req.params.id)
    const { message, phone } = req.body
    const { error } = sendMessageValidated.validate({ message, phone })
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    try {
        const device = await Device.findByPk(req.params.id)
        if (!device) {
            return res.status(400).json({ error: "Device not found!" });
        }
        if (!device.dataValues.status) {
            return res.status(400).json({ error: "Device is disconnected" });
        }
        const handler = new HandleWhastApp(req.params.id)
        await handler.message({ text: message, phone })
        return res.json({ message: "Success sending message" });
    } catch (err) {
        console.log(err)    
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const sendMessageMedia = async (req, res) => {
    const { caption, phone, fileUrl, mime } = req.body
    const { error } = sendMediaMessageValidated.validate({ caption, phone, fileUrl, mime  })
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    try {
        const device = await Device.findByPk(req.params.id)
        if (!device) {
            return res.status(400).json({ error: "Device not found!" });
        }
        if (!device.dataValues.status) {
            return res.status(400).json({ error: "Device is disconnected" });
        }
        const handler = new HandleWhastApp(req.params.id)
        await handler.media({ phone, caption, mime, url: fileUrl })
        return res.json({ message: "Success sending media message" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}


module.exports = {sendMessage, sendMessageMedia}