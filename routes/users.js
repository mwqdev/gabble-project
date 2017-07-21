const express = require('express');
const router = express.Router();

const models = require('../models');

let defaultUser = 'guest';

router.get('/', function (req, res) {
    if(req.session && req.session.authenticated) {
        let user = models.User.findOne({
            where: {
                username: req.session.username,
                password: req.session.password
            }
        }).then((user) => {
            req.session.username = req.body.username;
            req.session.userId = user.dataValues.id;
            let username = req.session.username;
            let userid = req.session.userId;
            res.render('index', {
                user: user
            });
        })
    }
    res.render('signin');
});

router.post('/', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    models.User.findOne({
        where: {
            username: username,
            password: password
        }
    }).then((user) => {
        if (!user) {
            defaultUser = null;
            res.redirect('/users/signup');
        } else {
            req.session.username = user.username;
            req.session.displayName = user.displayName;
            req.session.userId = user.dataValues.id;
            req.session.authenticated = true;
            res.redirect('/');
        }
    });
});

router.get('/signup', (req, res) => {
    res.render('signup', {title: 'Authentication', user: defaultUser});
    defaultUser = 'guest';
});

router.post('/signup', (req, res) => {

    let query = {where: {username: req.body.username}};

    models.User.findOne(query).then((user) => {
        if (user) {
            errors = [{param: 'username', msg: 'Username already in use', value: ''}];
            req.session.errors = errors;
            res.render('signup', {title: 'Authentication', errors: req.session.errors, user: defaultUser});
            req.session.errors = null;
        }
    });

    req.check('username', 'Username must be at least 4 characters').isLength({min: 4});
    req.check('username', 'Username may only contain alphanumeric characters').isAlphanumeric();
    req.check('password', 'Passwords must match').equals(req.body.confirmPassword);
    req.check('password', 'Password must be at least 6 characters').isLength({min: 6});

    let errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.render('signup', {title: 'Authentication', errors: req.session.errors, user: defaultUser});
        req.session.errors = null;
    } else {
        let user = models.User.build({
            username: req.body.username,
            displayName: req.body.displayName,
            password: req.body.password
        });
        user.save().then((user) => {
            req.session.username = user.username;
            req.session.displayName = user.displayName;
            req.session.authenticated = true;
            res.redirect('/');
        });
    }
});

router.get('/profile', (req, res) => {
    res.render('profile');
});

router.get('/signout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
