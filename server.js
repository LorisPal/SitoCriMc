var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var sqllite = require("./module/sqlite.js");
'use strict';
const nodemailer = require('nodemailer');

/* setta i percorsi di immagini e pagine */
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/img')); //contiene tutte le immagini

/* Porzione di codice adibita a creare una sessione di login amministratore autenticata */
app.get('/', function (req, res) {
    res.render('home/home1');
});

const admin_user = {
    user: "admin@admin.it", //inserire una mail valida
    pass: "admin"  //inserire una password
  }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    name: 'session',
    keys: ['username']
  }))

  //funzione di autenticazione chiamata al momento del login
  var checkAuthentication = function(req,res,next){
      if(req.session && req.session.admin_user){
          next();
      }else {
          res.redirect('/amministrazioneLogin');
      }
  }

app.get('/amministrazioneLogin', function (req, res) {
    res.render('home/amministrazioneLogin');
});
    //verifica se i dati immessi dall'utente corrispondono a quelli dell'amministratore
    app.post('/amministrazioneLogin', function(req,res){
        user = req.body.email;
        password = req.body.password;
        session = req.session;
        console.log(user, password)

        if(user == admin_user.user && password == admin_user.pass){
            session.admin_user = admin_user;
            console.log("user authenticated")
            console.log('session',session)
            res.redirect('/amministrazione');
        }else {
            console.log("user not authenticated")
            console.log('session',session)
            res.redirect('/amministrazioneLogin');
        }
    });

/* sezione dedidicata all'utente amministratore con vari servizi disponibili */
app.get('/amministrazione', checkAuthentication, function (req, res) {
    res.render('home/amministrazione');
});
    //logout dalla sessione
    app.post('/', function(req,res){
        req.session = null;
        console.log("session close")
        res.redirect('/');
    });
    //scrittura su db
    app.post('/notizie/new', function(req,res){
        console.log("sending data...")
        titolo = req.body.titolo;
        testo = req.body.testo;
        console.log(titolo,testo)
        sqllite.setNotizie(titolo,testo);
    });

app.post('/send', function(req,res) {
    // Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lcqvdtonbylnerkj@ethereal.email',
        pass: '7bKJF68nMygJ2fQmMx'
    }
});

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'lcqvdtonbylnerkj@ethereal.email', // sender address
        to: 'generalle913@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});

})

/* sezione dedicata alla visualizzazione delle notizie pubblicate dall'amministratore */
app.get('/new', function (req, res) {
    sqllite.getNotizie(function(news) {
        res.render('notizie/new', {
            "notizie_cri": news
        });
    });
});

app.get('/sostienici', function (req, res) {
    res.render('sostienici/sostienici');
});
app.get('/comitato', function (req, res) {
    res.render('chiSiamo/comitato');
});
app.get('/storia', function (req, res) {
    res.render('chiSiamo/storia');
});
app.get('/principi', function (req, res) {
    res.render('chiSiamo/principi');
});
app.get('/diu', function (req, res) {
    res.render('chiSiamo/diu');
});
app.get('/contatti', function (req, res) {
    res.render('contatti/contatti');
});
app.get('/corsiFormazione', function (req, res) {
    res.render('contatti/corsiFormazione');
});
app.get('/diventaVolontario', function (req, res) {
    res.render('contatti/diventaVolontario');
});
app.get('/richiediAmbulanza', function (req, res) {
    res.render('contatti/richiediAmbulanza');
});
app.get('/emergenza', function (req, res) {
    res.render('cosaFacciamo/emergenza');
});
app.get('/giovaniSviluppo', function (req, res) {
    res.render('cosaFacciamo/giovaniSviluppo');
});
app.get('/principiValori', function (req, res) {
    res.render('cosaFacciamo/principiValori');
});
app.get('/salute', function (req, res) {
    res.render('cosaFacciamo/salute');
});
app.get('/sociale', function (req, res) {
    res.render('cosaFacciamo/sociale');
});
app.get('/lavoraConNoi', function (req, res) {
    res.render('lavoraConNoi/lavoraConNoi');
});
//comando di ascolto porta
app.listen(8080, function () {
    console.log("Server start at http://localhost:8080")
});