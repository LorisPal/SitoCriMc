var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var sqllite = require("./module/sqlite.js");
const nodemailer = require('nodemailer');


/* 
setta i percorsi di immagini e pagine 
*/
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/img')); //contiene tutte le immagini


/* 
Crea una sessione di login amministratore autenticata 
*/
app.get('/', function (req, res) {
    res.render('home/home1');
});

const admin_user = {
    user: "", //inserire una mail valida
    pass: ""  //inserire una password
}

const local_user = {
    user: "", //inserire una mail valida
    pass: ""  //inserire una password
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    name: 'session',
    keys: ['username']
}))

//funzione di autenticazione chiamata al momento del login
var checkAuthentication = function (req, res, next) {
    if (req.session && req.session.admin_user) {
        next();
    } else {
        res.redirect('/amministrazioneLogin');
    }
}

app.get('/amministrazioneLogin', function (req, res) {
    res.render('home/amministrazioneLogin');
});
//verifica se i dati immessi dall'utente corrispondono a quelli dell'amministratore
app.post('/amministrazioneLogin', function (req, res) {
    user = req.body.email;
    password = req.body.password;
    session = req.session;
    console.log(user, password)

    if (user == admin_user.user && password == admin_user.pass) {
        session.admin_user = admin_user;
        console.log("user authenticated")
        console.log('session', session)
        res.redirect('/amministrazione');
    } else {
        console.log("user not authenticated")
        console.log('session', session)
        res.redirect('/amministrazioneLogin');
    }
});


/* 
sezione dedidicata all'utente amministratore con vari servizi disponibili 
*/
app.get('/amministrazione', checkAuthentication, function (req, res) {
    sqllite.getRichieste(function (richieste, richieste2, richieste3, courses) {
        res.render('home/amministrazione', {
            "richieste_ambulanza": richieste,
            "richieste_ambulanza2": richieste2,
            "richieste_ambulanza3": richieste3,
            "richieste_corsi": courses
        });
        console.log(richieste, richieste2, richieste3, courses);
    });
});

//logout dalla sessione
app.post('/', function (req, res) {
    req.session = null;
    console.log("session close");
    res.redirect('/');
});

/* 
Sezione Database
*/

//News: scrittura Db
app.post('/notizie/new', function (req, res) {
    console.log("sending data...");
    titolo = req.body.titolo;
    testo = req.body.testo;
    data = req.body.data;
    console.log(titolo, testo)
    sqllite.setNotizie(titolo, testo, data);
    res.redirect("/amministrazione");
});

app.post('/home/amministrazione', function (req, res) {
    console.log("Sending Data...");
    nomec = req.body.nomec;
    istruttore = req.body.istruttore
    inizio = req.body.inizio;
    requisiti = req.body.requisiti;
    descrizione = req.body.descrizione;
    console.log(nomec, istruttore, requisiti, descrizione);
    sqllite.setCourse(nomec, istruttore, inizio, requisiti, descrizione)
    res.redirect("/amministrazione");
});

var rimuovi = function (req, res, next) {
        bind = req.body.binding;
        next();
    }
app.post('/home/amministrazione/rimuovi',rimuovi, function (req, res) {
    sqllite.delCourse(bind);
    console.log(bind);
    res.redirect("/amministrazione");
});

app.post('/home/aggiungi', function (req, res) {
    console.log("aggiungi");
    
});


//News: lettura Db
app.get('/new', function (req, res, next) {
    sqllite.getNotizie(function (news) {
        res.render('notizie/new', {
            "notizie_cri": news
        });
    });
});

app.get('/corsiFormazione', function (req, res, next) {
    sqllite.getCourse(function (course) {
        res.render('contatti/corsiFormazione', {
            "richieste_corsi": course
        });
    });
});



/* 
Sezione Utenza
*/

//Invio richiesta ambulanza
app.post('/contatti/richiediAmbulanza', function (req, res) {
    console.log("sending data...")

    //select different template
    var selettore = req.body.trasporto;
    console.log(selettore);
    switch (selettore) {

        case "Programmato":
            nome = req.body.nome;
            cognome = req.body.cognome;
            prestazione = req.body.prestazione;
            oraInizio = req.body.oraInizio;
            oraFine = req.body.oraFine;
            partenza = req.body.partenza;
            destinazione = req.body.destinazione;
            console.log(nome, cognome, prestazione, oraInizio, oraFine, partenza, destinazione)
            sqllite.setProgrammati(nome, cognome, prestazione, oraInizio, oraFine, partenza, destinazione);

            template = `
        <h1>Croce Rossa Macerata</h1>
        <h3>Modulo richiesta Trasporto ${selettore}</h3>
        <ul>
            <li>Nome: ${req.body.nome}</li>
            <li>Cognome: ${req.body.cognome}</li>
            <li>Prestazione: ${req.body.prestazione}</li>
            <li>Orari: Inizio: ${req.body.oraInizio} - Fine: ${req.body.oraFine}</li>
            <li>Struttura/Indirizzo Partenza: ${req.body.partenza}</li>
            <li>Struttura/Indirizzo Destinazione: ${req.body.destinazione}</li>
        </ul>`
            break;

        case "Sportivo":
            evento = req.body.evento;
            luogo = req.body.luogo;
            indirizzo = req.body.indirizzo;
            oraInizio = req.body.oraInizio;
            oraFine = req.body.oraFine;
            console.log(evento, luogo, indirizzo, oraInizio, oraFine)
            sqllite.setEvento(evento, luogo, indirizzo, oraInizio, oraFine);


            template = `
        <h1>Croce Rossa Macerata</h1>
        <h3>Modulo richiesta Evento ${selettore}</h3>
        <ul>
            <li>Evento Sportivo: ${req.body.evento}</li>
            <li>Luogo: ${req.body.luogo}</li>
            <li>Struttura Ospitante: ${req.body.indirizzo}</li>
            <li>Orari: Inizio: ${req.body.oraInizio} - Fine: ${req.body.oraFine}</li>
        </ul>`
            break;

        case "Manifestazione":
            evento = req.body.evento;
            luogo = req.body.luogo;
            indirizzo = req.body.indirizzo;
            oraInizio = req.body.oraInizio;
            oraFine = req.body.oraFine;
            console.log(evento, luogo, indirizzo, oraInizio, oraFine)
            sqllite.setEvento(evento, luogo, indirizzo, oraInizio, oraFine);

            template = `
        <h1>Croce Rossa Macerata</h1>
        <h3>Modulo richiesta Evento ${selettore}</h3>
        <ul>
            <li>Evento Sportivo: ${req.body.evento}</li>
            <li>Luogo: ${req.body.luogo}</li>
            <li>Struttura Ospitante: ${req.body.indirizzo}</li>
            <li>Orari: Inizio: ${req.body.oraInizio} - Fine: ${req.body.oraFine}</li>
        </ul>`
            break;

        case "Taxi Sanitario":
            nome = req.body.nome;
            cognome = req.body.cognome;
            oraInizio = req.body.oraInizio;
            oraFine = req.body.oraFine;
            partenza = req.body.partenza;
            destinazione = req.body.destinazione;
            console.log(nome, cognome, oraInizio, oraFine, partenza, destinazione)
            sqllite.setTaxi(nome, cognome, oraInizio, oraFine, partenza, destinazione);

            template = `
        <h1>Croce Rossa Macerata</h1>
        <h3>Modulo richiesta Trasporto ${selettore}</h3>
        <ul>
            <li>Nome: ${req.body.nome}</li>
            <li>Cognome: ${req.body.cognome}</li>
            <li>Partenza: ${req.body.partenza} - Ora: ${req.body.oraInizio}</li>
            <li>Arrivo: ${req.body.destinazione} - Ora: ${req.body.oraFine}</li>
        </ul>`
            break;

        default:
            break;
    }

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', //smtp.provider_email
        port: 465,
        SSL: true, //see the provider smtp configuration
        auth: {
            user: '', //account user email
            pass: '' //user email pass
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '', // sender address
        to: '', // list of receivers k.naki94@gmail.com
        subject: 'richiesta trasporto', // Subject line
        text: '', // plain text body
        html: template // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
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