const express = require("express");
const bcrypt = require('bcryptjs');
const User = require("../Models/User");
const jwt = require('jsonwebtoken');
const Joi = require('joi')
const router = express.Router();
//Validation
const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8).required()
})
router.post("/", async (req, res) => {
    const { error } = schema.validate(req.body)
    //Check email
    const existEmail = await User.findOne({ email: req.body.email })
    //Hash a password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    if (error) {
        res.status(400).send(error.details[0].message)
    } else if (existEmail) {
        res.status(400).send("email already exists")
    }
    else {
        try {
            const user = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })
            user.save().then((data) => {
                const token = jwt.sign({ _id: data._id }, process.env.TOKEN_SECRET)
                res.header('auth', token).send(token)
            });

        }
        catch (err) {
            console.log(err)
            res.send(err)
        }
    }


});
module.exports = router;