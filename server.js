var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require("path");
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const fs = require('fs')
const multer = require('multer')
const admin = require("firebase-admin");

var { userModle, blogModel } = require("./dbrepo/modles");
var authRoutes = require("./routes/auth")
console.log(userModle, blogModel)

var { SERVER_SECRET } = require("./core/index");

const PORT = process.env.PORT || 5000;


var app = express()
app.use(cors({
    origin: [, 'http://localhost:3000', "https://sweet-app1.herokuapp.com"],
    credentials: true
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())
app.use("/", express.static(path.resolve(path.join(__dirname, "./fontend/build"))));
app.use('/', authRoutes)


////////////this part for specific file schema server/////

app.get('getblogs', (req, res, next) => {

    blogModel.find({}, function (err, data) {
        console.log(data)
        if (!err) {
            res.status(200).send({
                data: data
            })

        } else {
            res.send(403).send({
                message: 'server err'
            })
        }

    })
})







app.use(function (req, res, next) {
    console.log('cookie', req.cookies)

    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    console.log("Asign value of token  ", req.cookies.jToken)

    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        console.log("decodedData .................>>>>>>>>>>  ", decodedData)
        if (!err) {
            const issueDate = decodedData.iat * 1000
            const nowDate = new Date().getTime()
            const diff = nowDate - issueDate

            if (diff > 300000) {
                res.status(401).send('Token Expired')

            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    role: decodedData.role
                }, SERVER_SECRET)

                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                })
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next()
            }
        } else {
            res.status(401).send('invalid Token')
        }

    });

})

////// Get profile and user data in user interface
////// Get profile and user data in user interface
////// Get profile and user data in user interface

app.get('/profile', (req, res, next) => {

    console.log(req.body)


    userModle.findById(req.body.jToken.id, "name email imageUrl role cratedOn",
        function (err, data) {

            console.log("Get profile Err ", err)
            console.log("Get Profile Data ", data)
            if (!err) {
                res.send({
                    status: 200,
                    profile: data
                })
            } else {
                res.status(404).send({
                    message: "server err"
                })
            }

        })

})

//////Cart Upload Api
//////Cart Upload Api
//////Cart Upload Api
//////Cart Upload Api

const storage = multer.diskStorage({
    destination: './upload/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })

//==============================================

var SERVICE_ACCOUNT = {
    "type": "service_account",
    "project_id": "blog-personal-portfolio",
    "private_key_id": "4eddf93003b40905d13c03f38e9cef90d403197f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDeSgme4lAGzA8j\nGzp62YLnROtmc9v5JfaeWqu0MyWQjbntMzl28NGbav939cGq5JA7OJu/pLwzIGh2\nqDDYBAyUXc+t/s3klaSmNRTSZCs1fQQSWOrBBU7o7jLv3l0OKqXOqdQLPS3eZ2O7\nhE6M/EGr2nJVjqMtx9yIQOhrj4gY5ud02rcfZAW5nM8m5XmmXaZIZiblzqKRyulK\nbj1saVw/LIYM1uYpOMIUg8qff61rFSqFu1Ayuyal1rN3N3+RjbpAIOSnShJ87/QN\nX9TLHNY4dimPxWjKTqddHwrl59X46ncCwvhV4cPSnkxvqtcqYQsoMC+PCMfwV/6a\nFcw6SyxVAgMBAAECggEADmJ6Jub8SMRRwnLToPmMaAzksteSh5f2Up8Jd3rL1oPl\nYT0sXc8NsWIGMCweIUHzN3HdWlR9vU0+lVci+gehDMTZWKghiMZKRlsvAsJqrWZu\nqgVJA76lMZugfjdEjFMkMbB5wVRvMHI+WPch4iu80DMtrO2zD5ZcZhDVOYirRPkl\nZ2di0ad3TG+4ICbxPeSN7oRQqZtVIpGuwin2SWISJqH0qz6q8Oh6Dizw2OW8WxjH\nwhvdyFf2942i8jQZ7MsZmNGKBoVy9HnhFbdVRd/gy6Y5zay+4680d8Virwjp0396\nLeEaLQzGJS8HN8NDItHreWPbC7nPCtqXqwvbpE4vTQKBgQDvIymLOOMd/V3J4aF1\nlBlb96tQRa81I5YArbUYzos/zjIUPATlHXZMfILHgjDfUNazawM0W6nXTyqiCoaI\nv2WlzXjV+V8Xm/THF/U1TlRStja/wH4NEB0Sqwg8+4SnQ3tnJ7f91wL26JR63ldu\nhrPEUhz4bIKrvVJ2ld9MauSqQwKBgQDt9rzO4N9gWMREuFBOY2g3icISNWar6Yof\nIR3NMKYuv85cftOu22IusCZBPOcldUNsfLYQHfL9JzC3T+UrpR/JXG9D2wp19rjN\nfRZqxyQ5pyDXnb9yZdxWw7lVtQz+B/4Fc5+1u5lAFvAj2vCZtallTQfmsjJmhtPh\nnfyCVeZhhwKBgH+b5+NfK/Mo7Q9508sGiLHG7Cgdx2033Cfoiib+sNgPlDGwBXyt\nyB7womkMVEAWxzte84rRD0TR/hISQ9BdMkTT7JNiSxgyJODJLBSSA/VPPs/8TEd0\nPc9kbTT9ksAfBo75ZvmR7wcK/ZDDbSyRvQQaPVNjtCcpFAQr3cjNkdA5AoGBAKKT\ny2UwH4zsuJMWtc8IfYBMPuo/z7iuIu6nqnuwvCj+ZFevUqKJQigRsuEpYeammfz5\nq02RmJy6dL8Y98J82x2waFgcw6XafWHvDyy+h5JYC8kj/lODIimpKOtUed7oyPUi\njMAVvlsaEND+WRk7EtOh8D7+Cg8gGIxxar4FQBPrAoGBAKPScuq4ud97DSSDIIWi\nTrm8jraNRdouqK48mjriqKApauVT+cr3oXvwcnx5nvDcgF4wXNqK8fx2pBa19tR0\nAsgYXtuM/6rQshIMyW5mfhmDWkLalxT1UxbioooiE79tHYAU+gTQTszPp5vK5YxG\nT2efRQKStzqWUub/e/HHY6ju\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-7i44a@blog-personal-portfolio.iam.gserviceaccount.com",
    "client_id": "106142576133893070061",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7i44a%40blog-personal-portfolio.iam.gserviceaccount.com"
}


// var SERVICE_ACCOUNT = JSON.parse(process.env.SERVICE_ACCOUNT)

admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    // DATABASE_URL: process.env.DATABASE_URL

    DATABASE_URL: "https://blog-personal-portfolio-default-rtdb.firebaseio.com"

});

const bucket = admin.storage().bucket("gs://blog-personal-portfolio.appspot.com/");

//==============================================

app.post("/uploadimage", upload.any(), (req, res, next) => {

    bucket.upload(
        req.files[0].path,

        function (err, file, apiResponse) {
            if (!err) {
                console.log("api resp: ", apiResponse);

                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {

                    if (!err) {
                        // console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        console.log(req.body.email)
                        console.log(req.body.avalablity)
                        console.log("headerskdflasfjks ka data  ===================>>>>> ", req.headers.jToken.id)
                        console.log("headerskdflasfjks request headers  ===================>>>>> ", req.headers)
                        userModle.findById(req.headers.jToken.id, 'email role', (err, users) => {
                            console.log("Adminperson ====> ", users.email)

                            if (!err) {
                                users.update({ imageurl: urlData[0] }, {}, function (err, data) {
                                    console.log(users)
                                    res.send({
                                        status: 200,
                                        message: "image uploaded",
                                        picture: users.profilePic
                                    })
                                })
                            }
                            //         .then((data) => {
                            //             console.log(data)
                            //             res.send({
                            //                 status: 200,
                            //                 message: "Product add successfully",
                            //                 data: data
                            //             })

                            //         }).catch(() => {
                            //             console.log(err);
                            //             res.status(500).send({
                            //                 message: "Not added, " + err
                            //             })
                            //         })
                            // }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})


////// blog updates from Database in user Interface


app.get('/uploadblog', (req, res, next) => {
    if (!req.body.title || !req.body.detail || !req.body.description) {
        res.status(404).send(`
            {please provide complete information about blog }
            `)
        return;
    }
       





    userModle.findOne({ email: req.body.jToken.email }, (err, user) => {
        console.log("afafa", user)
        if (!err) {
            sweetOrdersModel.create({
                title: req.body.title,
                description: req.body.description,
                detail: req.body.detail,
                profileimage: user.imageurl,
                
            }).then((data) => {
                res.status(200).send({
                    message: "new Post Has been uploaded ",
                    data: data
                })
            }).catch(() => {
                res.status(500).send({
                    message: "sorry! uploading failed  "
                })
            })
        }
        else {
            res.send({
                message:"error"

            })
          }
    })
})

app.post('/editBlog', (req, res, next) => {
    if (!req.body.title || !req.body.detail || !req.body._id || !req.body.description) {
        res.status(404).send(`
            {please provide complete information about blog }
            `)
        return;
    }

    
    blogModel.findOne({_id: req.body._id}, function (err, user) {
        console.log("Finded use during uploadin Blogs Post", user)
        if (!err) {
            blogModel.updateOne({
                title: req.body.title,
                description: req.body.description,
                detail: req.body.detail,
            })
                .then((data) => {
                    console.log(data)
                    res.send({
                        status: 200,
                        message: "BlogPost hasbeen Updated",
                        data: data
                    })

                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send({
                        message: "Not added, "
                    })
                })
        }
        else {
            res.send({
                message: "error"
            });
        }
    })
})



app.post('/deleteblog', (req, res, next) => {

    blogModel.findById(req.body.id, {}, (err, data) => {
        if (!err) {
            data.remove();
            res.status(200).send({
                message: 'succesfully deleted'
            })
        }
        else {
            res.status(500).send({
                message: 'something went wrong'
            })
        }
    })
})



app.listen(PORT, () => {
    console.log("surver is running on : ", PORT)
})
