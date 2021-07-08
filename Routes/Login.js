const express = require("express");
const bcrypt = require('bcryptjs');
const User = require("../Models/User");
const Joi = require('joi')
const router = express.Router();
const jwt = require('jsonwebtoken');
const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required()
})

router.post('/', async (req, res) => {
    const { error } = schema.validate(req.body)
    try {
        if (error) {
            res.status(400).send(error.details[0].message)
        }
        //Check user
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send("email is wrong")
        }
        //Check password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.status(400).send("Inwalid password")
        }
        else {
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
            res.header('auth', token).send(token)
        }
    } catch (err) {
        console.log(err)
    }
}
)

module.exports = router;