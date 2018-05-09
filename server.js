var express = require('express');
var app = express();

app.set('view engine', 'ejs');
//contiene tutte le view delle pagine .ejs
app.use(express.static(__dirname + '/views'));
//contiene tutte le immagini
app.use(express.static(__dirname + '/img'));

//route pagine
app.get('/', function(req, res){
    res.render('home/home1');
});
app.get('/sostienici', function(req, res){
    res.render('sostienici/sostienici');
});
app.get('/comitato', function(req, res){
    res.render('chiSiamo/comitato');
});
app.get('/storia', function(req, res){
    res.render('chiSiamo/storia');
});
app.get('/principi', function(req, res){
    res.render('chiSiamo/principi');
});
app.get('/diu', function(req, res){
    res.render('chiSiamo/diu');
});
app.get('/contatti', function(req, res){
    res.render('contatti/contatti');
});
app.get('/corsiFormazione', function(req, res){
    res.render('contatti/corsiFormazione');
});
app.get('/diventaVolontario', function(req, res){
    res.render('contatti/diventaVolontario');
});
app.get('/richiediAmbulanza', function(req, res){
    res.render('contatti/richiediAmbulanza');
});
app.get('/emergenza', function(req, res){
    res.render('cosaFacciamo/emergenza');
});
app.get('/giovaniSviluppo', function(req, res){
    res.render('cosaFacciamo/giovaniSviluppo');
});
app.get('/principiValori', function(req, res){
    res.render('cosaFacciamo/principiValori');
});
app.get('/salute', function(req, res){
    res.render('cosaFacciamo/salute');
});
app.get('/sociale', function(req, res){
    res.render('cosaFacciamo/sociale');
});
app.get('/lavoraConNoi', function(req, res){
    res.render('lavoraConNoi/lavoraConNoi');
});
//comando di ascolto porta
app.listen(8080, function(){
    console.log("Server start at http://localhost:8080")
});