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
app.get('/chiSiamo', function(req, res){
    res.render('chiSiamo/chiSiamo');
});
app.get('/contatti', function(req, res){
    res.render('contatti/contatti');
});
app.get('/cosaFacciamo', function(req, res){
    res.render('cosaFacciamo/cosaFacciamo');
});
app.get('/lavoraConNoi', function(req, res){
    res.render('lavoraConNoi/lavoraConNoi');
});
//comando di ascolto porta
app.listen(8080, function(){
    console.log("Server start at http://localhost:8080")
});