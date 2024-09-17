const Joi = require('joi')

const sendMessageValidated = Joi.object({
    message: Joi.string().required(),
    phone: Joi.string().required()
})

const sendMediaMessageValidated = Joi.object({
    caption: Joi.string(),
    phone: Joi.string().required(),
    fileUrl: Joi.string().required().uri(),
    mime: Joi.valid("Image", 'Video', "Document", "Audio")
})
module.exports = { sendMessageValidated, sendMediaMessageValidated }