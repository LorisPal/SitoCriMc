var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/img')); //contiene tutte le immagini

//route pagine
app.get('/', function (req, res) {
    res.render('home/home1');
});

const admin_user = {
    user: "", //inserire una mail valida
    pass: ""  //inserire una password
  }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    name: 'session',
    keys: ['username']
  }))

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

app.get('/amministrazione', checkAuthentication, function (req, res) {
    res.render('home/amministrazione');
});

app.post('/amministrazione', function(req,res){
    req.session = null;
    console.log("session close")
    res.redirect('/amministrazioneLogin');
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