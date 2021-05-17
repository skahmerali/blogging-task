var express = require('express');
var bcrypt = require('bcrypt-inzi');
var jwt = require('jsonwebtoken');
var postmark = require('postmark');
var { SERVER_SECRET } = require("../core/index");
var client = new postmark.Client("");


var { userModel, otpModel } = require('../dbrepo/modles');
console.log("usermodel", userModel);
var api = express.Router()

api.post('signup', (req, res, next) => {
    console.log(req.body.userName)
    console.log(req.body.email)
    if (!req.body.userName
        || !req.body.email
        || !req.body.country
        || !req.body.gender
        || !req.body.password) {
        res.status(403).send(
            `please nikalin ap yaha se `
        );
        return
    };
    userModel.findOne({ email: req.body.email }, function (err, data) {
        if (err) {
            console.log(err)
        } else if (!data) {
            bcrypt.stringToHash(req.body.password).then(function (HashPassword) {
                var newUser = new userModel({
                    "name": req.body.userName,
                    "email": req.body.email,
                    "password": HashPassword,
                    "country": req.body.country,
                    "gender": req.body.gender,
                });
                newUser.save((err, data) => {
                    if (!err) {
                        res.status(200).send({
                            message: "User created"
                        })
                    } else {
                        console.log(err)
                        res.status(403).send({
                            message: "user already esist"
                        })
                    };

                })

            })
        } else if (err) {
            res.status(500).send({
                message: "db error "
            })
        }
        else {
            res.send(403).send({
                message: "User already exist"
            })
        }

    })
});



api.post("/login", (req, res, next) => {
    console.log(req.body.email)
    console.log(req.body.HashPassword)
    if (!req.body.email || !req.body.passowrd) {
        res.status(403).send(
            ` please send email and passwod in json body.
            e.g:
            {
                "email": "ahmer@gmail.com",
                "password": "abc",
            }
            `)
        return;
    }
    userModel.findOne({ email: req.body.email }, (err, loginRequestUser) => {
        console.log(loginRequestUser)
        console.log(err)

        if (err) {
            res.status(500).send({
                message: 'an error occured'
            })
            console.log(err)

        } else if (loginRequestUser) {
            console.log(loginRequestUser)
            bcrypt.varifyHash(req.body.passowrd, loginRequestUser.password).then(match => {
                if (match) {
                    var token = jwt.sign({
                        name: loginRequestUser.name,
                        email: loginRequestUser.email,
                        phone: loginRequestUser.phone,
                        role: loginRequestUser.role,
                        id: loginRequestUser.id,
                        ip: req.connection.remoteAddress
                    }, SERVER_SECRET);
                    res.cookie('jToken', token, {
                        maxAge: 86_400_000,
                        httpOnly: true
                    });
                    res.send({
                        message: 'login succes ',
                        status: 200,
                        loginRequestUser: {
                            name: loginRequestUser.name,
                            email: loginRequestUser.email,
                            phone: loginRequestUser.phone,
                            role: loginRequestUser.role
                        }
                    });

                } else {
                    console.log('not mached')
                    res.send({
                        message: "Incorrect pasowrd ",
                        status: 404
                    })
                }
            }).catch(e => {
                console.log(" error : ", e)
            })
        } else {
            res.send({
                message: "  User not Found ",
                status: 403
            })
        }
    })
});


api.post("/logout ", (req, res, next) => {
    res.cookie("jtoken", "", {
        maxAge: 86_400_000,
        httpOnly: true
    });
})
module.exports = api;
function getRandomArbitrary(min, max) {
    return Match.random() * (max - min) + min;
}