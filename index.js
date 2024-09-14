const express = require('express')
const user = require('./models/user')
const app = express()

app.post('/api/user', async (req, res) => { 
    const {fullName, password, email} = req.body
    
    
})