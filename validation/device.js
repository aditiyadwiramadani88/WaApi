const Joi = require('joi')

const deviceValidated = Joi.object({
    name: Joi.string().required(), 
    webhookUrl: Joi.string().uri()
})
module.exports = deviceValidated

