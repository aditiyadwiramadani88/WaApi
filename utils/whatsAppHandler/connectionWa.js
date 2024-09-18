const {
    DisconnectReason,
    useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { Boom } = require("@hapi/boom");
const { Device } = require('../../models')
const axios = require('axios')
const fs = require('fs').promises
const dataDevices = [];
const Qrcode = [];


class HandleWhastApp {
    constructor(deviceId) {
        const result = dataDevices.find(item => item.deviceId == deviceId);
        this.sock = result?.sock;
        this.pathSession = String(`${__dirname}/session/device-${deviceId}`).replace('utils/whatsAppHandler', '')
        this.deviceId = deviceId
    }

    async connect() {
        const { state, saveCreds } = await useMultiFileAuthState(this.pathSession);
        const sock = makeWASocket({
            printQRInTerminal: true,
            auth: state,
            qrTimeout: 60000,
        });
        this.sock = sock
        this.sock.ev.on("creds.update", saveCreds);
        this.sock.ev.on("connection.update", this.handleConnectionUpdate.bind(this));
        this.sock.ev.on("messages.upsert", this.handleMessageUpsert.bind(this));
    }

    async reconnect() {
        await this.connect();
    }

    async handleConnectionUpdate(update) {
        const { connection, lastDisconnect } = update;

        if (update.qr) {
            const indexById = Qrcode.findIndex(qrData => qrData?.deviceId == this.deviceId);
            if (indexById >= 0) {
                Qrcode[indexById].qr = update.qr
            } else {
                Qrcode.push({ deviceId: this.deviceId, qr: update.qr })
            }
        }

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect.error instanceof Boom &&
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            await Device.update({ status: 0 }, {
                where: {
                    id: this.deviceId
                }
            });
            if (shouldReconnect) {
                await this.reconnect();
            } else {
                const indexById = dataDevices.findIndex(deviceData => deviceData?.deviceId == this.deviceId);
                await fs.rm(this.pathSession, { recursive: true, force: true })
                dataDevices.splice(indexById, 1)

            }

        } else if (connection === "open") {
            dataDevices.push({ deviceId: this.deviceId, sock: this.sock })
            const user = this.sock.user.id;
            const phoneNumber = this.getNumberPhone(user)
            const indexById = Qrcode.findIndex(qrData => qrData?.deviceId == this.deviceId);
             Qrcode.splice(indexById, 1)
            await Device.update({ status: 1, phone: phoneNumber }, {
                where: {
                    id: this.deviceId
                }
            });
        }
    }

    async handleMessageUpsert({ messages }) {
        const m = messages[0]
        const key = m.key
        let remoteJid = key.remoteJid;
        let txt = m
        if (!m || remoteJid == "status@broadcast") {
            return;
        }
        if (!String(remoteJid).includes('@g.us')) {
            remoteJid = this.getNumberPhone(key.remoteJid)
        }
        try {
            const messageType = Object.keys(m.message)[0]
            if (messageType == "imageMessage") {
                const messageImage = m.message.imageMessage
                txt = messageImage?.caption
            }
            else if (messageType == 'videoMessage') {
                const docMessage = m.message.videoMessage
                txt = docMessage?.caption
            } else if (messageType == 'conversation') {
                txt = m.message.conversation
            } else if (messageType == 'extendedTextMessage') {
                txt = m.message.extendedTextMessage.text
            }
            const dataMessage = {
                messageData: {
                    txt: txt,
                    message_type: messageType
                },
                message_from: {
                    from_me: key.fromMe,
                    fromGroup: key?.participant ? true : false,
                    number: remoteJid,
                }
            }
            await this.sendWebhook(dataMessage)

        } catch (e) {
            console.log("error reply message", e)
        }
    }

    getNumberPhone(user) {
        try {
            const inputString = String(user);
            const phoneNumber = inputString.match(/^\d+/)[0];
            return phoneNumber;
        } catch (e) {
            return 0;
        }
    }

    async message({ text, phone }) {
        await this.sock.sendMessage(`${phone}@s.whatsapp.net`, { text })
        return true;
    }


    async media({ caption, url, phone, mime }) {

        if (mime == "Image") {
            await this.sock.sendMessage(`${phone}@s.whatsapp.net`, { image: { url }, caption: caption }, { quoted: "" })
        }
        if (mime == "Audio") {
            await this.sock.sendMessage(`${phone}@s.whatsapp.net`, { audio: { url }, caption: caption }, { quoted: "" })
        }
        if (mime == "Video") {
            await this.sock.sendMessage(`${phone}@s.whatsapp.net`, { video: { url }, caption: caption }, { quoted: "" })
        }
        if (mime == "Document") {
            const buffer = await axios.get(url, { responseType: 'arraybuffer' });
            const name = url.split('/').pop();
            const type = buffer.headers['content-type'];
            await this.sock.sendMessage(`${phone}@s.whatsapp.net`, {
                document: buffer.data,
                fileName: name,
                mimetype: type,
                mentions: mentions,
                caption: caption
            }, { quoted: "" })
        }

        return true;
    }


    async sendWebhook(data) {
        try {
            const device = await Device.findByPk(this.deviceId)
            if (device.webhookUrl) {
                const response = await axios.post(device.webhookUrl, data)
                console.log("Sending Request in Webhook" + device.webhookUrl)
            }
        } catch (e) {
            console.log("Error sending request" + e)
        }
    }
}

module.exports = { HandleWhastApp, Qrcode, dataDevices }