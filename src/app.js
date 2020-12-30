// run terminal = npm install
// Run project terminal type = npm run dev

const express = require("express");
const path = require("path");
const hbs = require('hbs');
const exphbs = require('express-handlebars');
require("./db/conn");
const app = express();
const Register = require("./models/register");
const port = process.env.PORT || 8000;
const nodemailer = require('nodemailer');

// public static path
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");


app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.use(express.static(static_path)) // For serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ']abc@gmail.com', // enter your email
        pass: 'abc1234' // enter your email password
    }
});


// routing
app.get("/", (req, res) => {
    res.render('contacts');

})

app.get('/contacts', (req, res) => {
    res.render('contacts');
})

app.get('/login', (req, res) => {
    res.render('login');
});

// secure register and login

app.post("/contacts", async(req, res) => {

    try {
        const user = new Register({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password,
        });
        const createuser = await user.save();
        var mailOptions = {
            from: 'abc@gmail.com', //enter your email
            to: `${req.body.email}`,
            subject: 'You are successfully Register',
            text: `you account successfully Register.`
        };
        const username = { "username": req.body.fname }
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).render('index', username);
    } catch (e) {
        res.status(400).send(e);
    }

});

// log in register
app.post("/login", async(req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        var mailOptions = {
            from: 'abc@gmail.com',
            to: `${req.body.email}`,
            subject: 'You are successfully login',
            text: `you account successfully login.`

        };
        const userData = await Register.findOne({ email: email });

        // console.log(userData.password); //find password
        // console.log(req.body.password); // usre form type password

        if (password === userData.password) {
            const username = { "username": userData.username }
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.status(201).render('index', username);
        } else {
            res.status(400).send("Please valid login.");
        }
    } catch (e) {
        res.status(400).send(e);
    }

});


//404 error page
app.get('*', (req, res) => {
    res.render("404error", {
        errorMsg: 'Opps! Page Not Found'
    });
})

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});