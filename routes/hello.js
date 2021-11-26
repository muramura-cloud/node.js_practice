const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('mydb.sqlite3');
const { check, validationResult } = require('express-validator');


router.get('/', function (req, res, next) {
    db.serialize(() => {
        db.all('select * from mydata', (err, rows) => {
            if (!err) {
                let data = {
                    title: 'hello',
                    content: rows,
                }

                res.render('hello', data);
            }
        })
    })
});

router.get('/add', function (req, res, next) {
    let data = {
        title: 'add',
        content: 'add new record.',
        form: { name: '', mail: '', age: 0 },
    };

    res.render('hello/add', data);
});

router.get('/show', function (req, res, next) {
    const id = req.query.id;
    db.serialize(() => {
        db.get('select * from mydata where id = ?', [id], (err, row) => {
            if (!err) {
                let data = {
                    title: 'hello/show',
                    content: 'id:' + id + 'のレコード',
                    mydata: row,
                };

                res.render('hello/show', data);
            }
        });
    })
});

router.get('/edit', function (req, res, next) {
    const id = req.query.id;
    db.serialize(() => {
        db.get('select * from mydata where id = ?', [id], (err, row) => {
            if (!err) {
                let data = {
                    title: 'hello/show',
                    content: 'id:' + id + 'のレコード',
                    mydata: row,
                };

                res.render('hello/edit', data);
            }
        });
    })
});

router.get('/find', function (req, res, next) {
    db.serialize(() => {
        db.all('select * from mydata', (err, rows) => {
            if (!err) {
                let data = {
                    title: 'hello/find',
                    mydata: rows,
                    find: '',
                    content: '検索条件を入力してください。',
                }

                res.render('hello/find', data);
            }
        });
    });
});

router.get('/delete', function (req, res, next) {
    const id = req.query.id;
    db.serialize(() => {
        db.get('select * from mydata where id = ?', [id], (err, row) => {
            if (!err) {
                let data = {
                    title: 'hello/delete',
                    content: 'id:' + id + 'のレコード',
                    mydata: row,
                };

                res.render('hello/delete', data);
            }
        });
    })
});


router.post('/add', [
    check('name', '名前は必ず入力してください。').notEmpty().escape(),
    check('mail', 'メールを入力してください。').isEmail().escape(),
    check('age', '年齢を必ず入力してください。').custom(value => {
        return value >= 0 & value <= 120;
    }),
], (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let result = "<ul class='text-danger'>";
        let result_arr = errors.array();
        for (let n in result_arr) {
            result += '<li>' + result_arr[n].msg + '</li>';
        }
        result += '</ul>';

        let data = {
            title: 'hello/add',
            content: result,
            form: req.body,
        }

        res.render('hello/add', data);
    } else {
        const name = req.body.name;
        const mail = req.body.mail;
        const age = req.body.age;

        db.serialize(() => {
            db.run('insert into mydata (name,email,age) values (?,?,?)', name, mail, age);
        });
        res.redirect('/hello');
    }
});

router.post('/edit', function (req, res, next) {
    const id = req.body.id;
    const name = req.body.name;
    const mail = req.body.mail;
    const age = req.body.age;

    const q = 'update mydata set name=?,email=?,age=? where id = ?';

    db.serialize(() => {
        db.run(q, name, mail, age, id);
    });

    res.redirect('/hello');
});

router.post('/delete', function (req, res, next) {
    const id = req.body.id;

    const q = 'delete from mydata where id = ?';

    db.serialize(() => {
        db.run(q, id);
    });

    res.redirect('/hello');
});

router.post('/find', function (req, res, next) {
    let find = req.body.find;

    db.serialize(() => {
        const q = 'select * from mydata where ';
        db.all(q + find, [], (err, rows) => {
            if (!err) {
                let data = {
                    title: 'hello/find',
                    find: find,
                    content: '検索条件' + find,
                    mydata: rows,
                };

                res.render('hello/find', data);
            }
        });
    });
});

module.exports = router;
