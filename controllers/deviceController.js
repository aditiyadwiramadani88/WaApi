const { Device, User } = require('../models');
const { HandleWhastApp, Qrcode } = require('../utils/whatsAppHandler/connectionWa');
const deviceValidated = require('../validation/device');
const { userValidation } = require('../validation/user');

const showDevices = async (req, res) => {
    const devices = await Device.findAll({
        where: { userId: req.user.id }
    });
    return res.json(devices)
}

const createDevice = async (req, res) => {
    const { name, webhookUrl } = req.body
    const { error } = deviceValidated.validate({ name, webhookUrl })
    if (error) {
        return res.status(400).json({ "error": error.details[0].message })
    }   
    const { dataValues } = await User.findByPk(req.user.id)
    const deviceByUser = await Device.findAll({ where: { userId: req.user.id } })

    if (dataValues.deviceLimit >= deviceByUser.length) {
        const createdDevice = await Device.create({ name, userId: req.user.id, status: 0 })
        return res.json(createdDevice)
    }
    if (!dataValues.deviceLimit) {
        const createdDevice = await Device.create({ name, userId: req.user.id, status: 0 })
        return res.json(createdDevice)
    }
    return res.status(400).json({ error: `You only have a limit of ${deviceLimit} devices` })
}

const findById = async (req, res) => {
    const device = await Device.findByPk(req.params.id)
    if (!device) {
        return res.status(400).json({ 'error': "Device not found" });
    }
    return res.json(device);
}

const updatedDevice = async (req, res) => {
    const { name, webhookUrl } = req.body
    const { error } = deviceValidated.validate({ name, webhookUrl })
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    const device = await Device.findByPk(req.params.id)
    if (!device) {
        return res.status(400).json({ 'error': "Device not found" });
    }
    await Device.update({ name, webhookUrl }, {
        where: {
            id: req.params.id
        }
    })
    return res.json({ success: "Success updated devices" });
}

const deleteDevice = async (req, res) => {
    const device = await Device.findByPk(req.params.id)
    if (!device) {
        return res.status(400).json({ error: "Device not found" });
    }
    if (!device.status) {
        await Device.destroy({
            where: {
                id: req.params.id
            }
        })
        return res.json({ error: "Success deleted device" });
    }
    return res.status(400).json({ error: "Device is connected Can't deleted" });
}


const scanQrCode = async (req, res) => {
    const findDevice = await Device.findByPk(req.params.id)
    if (!findDevice) {
        return res.status(404).json({ error: "Device not found!" })
    }
    if (findDevice.status) {
        return res.status(400).json({ error: "Device is connected" })
    }
    const handler = new HandleWhastApp(req.params.device)
    await handler.connect()
    return res.json({ message: 'Sucess scan to devices' })
}

const getQrCode = async (req, res) => {
    const findDevice = await Device.findByPk(req.params.id)
    if (!findDevice) {
        return res.status(404).json({ error: "Device not found!" })
    }
    if (findDevice.status) {
        return res.status(400).json({ error: "Device is connected" })
    }
    const result = Qrcode.find(item => item.deviceId === findDevice.id);
    return res.json({ 'message': 'Success Get Qr', 'data': result?.qr })
}


module.exports = {
    createDevice,
    findById,
    showDevices,
    deleteDevice,
    updatedDevice,
    scanQrCode,
    getQrCode
}