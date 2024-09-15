const Joi = require('joi')

const userValidation = Joi.object({ 
    fullName: Joi.string().required(), 
    password: Joi.string().min(8).required(), 
    email: Joi.string().email(), 
    deviceLimit: Joi.number()
})

const userValidationUpdated = Joi.object({ 
    fullName: Joi.string().required(), 
    password: Joi.string().min(8), 
    email: Joi.string().email(), 
    deviceLimit: Joi.number()
})

const loginValidated = Joi.object({ 
    email: Joi.string().email().required(), 
    password: Joi.string().required() 
})
module.exports = {userValidation, userValidationUpdated, loginValidated}

