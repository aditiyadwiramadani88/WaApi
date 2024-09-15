const { User } = require('../models');
const { userValidation, userValidationUpdated, loginValidated } = require('../validation/user');
const hashPassword = require('../utils/helper');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { fullName, password, email, deviceLimit } = req.body;
    const { error } = userValidation.validate({ fullName, password, email,deviceLimit });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const existsEmail = await User.findOne({ where: { email } });
    if (existsEmail) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const passwordHased = hashPassword(password);
    const userData = await User.create({ fullName, email, password: passwordHased, role: "USER", deviceLimit });
    return res.json(userData);
};

const getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
};

const updateUser = async (req, res) => {
    const { fullName, password, email, deviceLimit } = req.body;
    const { error } = userValidationUpdated.validate({ fullName, password, email, deviceLimit });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findByPk(req.params.id);
    if (user) {
        const existsEmail = await User.findOne({ where: { email } });
        if (existsEmail && user.email != existsEmail.email) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const data = { fullName, email, deviceLimit };
        if (password) {
            data.password = hashPassword(password);
        }
        await User.update(data, { where: { id: req.params.id } });
        return res.json({ success: "Successfully updated data" });
    }
    return res.status(404).json({ error: "User not found" });
};

const getUserById = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        return res.json(user);
    }
    return res.status(404).json({ error: "User not found" });
};

const deleteUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        await User.destroy({ where: { id: req.params.id } });
        return res.json({ success: "Successfully deleted data" });
    }
    return res.status(404).json({ error: "User not found" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const { error } = loginValidated.validate({ email, password });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ error: "Email is not registered" });
    }
    if (hashPassword(password) === user.password) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET);
        return res.json({ token });
    }
    return res.status(400).json({ error: 'Invalid password' });
};


module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
    deleteUser,
    loginUser
};
