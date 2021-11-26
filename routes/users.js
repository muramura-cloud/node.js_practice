var express = require('express');
var router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');

/* GET users listing. */
router.get('/', function (req, res, next) {
    db.User.findAll().then(users => {
        let data = {
            title: 'Users/Index',
            content: users,
        };

        res.render('users/index', data);
    });
});

router.get('/add', function (req, res, next) {
    let data = {
        title: 'Users/Add',
        form: new db.User(),
        err: null,
    };

    res.render('users/add', data);
});

router.post('/add', function (req, res, next) {
    const form = {
        name: req.body.name,
        pass: req.body.pass,
        mail: req.body.mail,
        age: req.body.age,
    };

    db.sequelize.sync()
        .then(() => db.User.create(form)
            .then(user => {
                res.redirect('/users');
            })
            .catch(err => {
                let data = {
                    title: 'Users/Add',
                    form: form,
                    err: err,
                };

                res.render('users/add', data);
            }));
});

router.get('/login', function (req, res, next) {
    let data = {
        title: 'Users/Login',
        content: '名前とパスワードを入力してください。',
    };

    res.render('users/login', data);
});

router.post('/login', (req, res, next) => {
    db.User.findOne({
        where: {
            name: req.body.name,
            pass: req.body.pass,
        }
    }).then(user => {
        if (user != null) {
            req.session.login = user;
            let back = req.session.back;
            if (back == null) {
                back = '/';
            }
            res.redirect(back);
        } else {
            let data = {
                title: 'Users/Login',
                content: '名前かパスワードに問題があります。',
            };
            res.render('users/login', data);
        }
    })
});

module.exports = router;
