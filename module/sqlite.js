const sqlite3 = require('sqlite3').verbose();
const database = './sitoCri.db';

module.exports = {
    getNotizie: function (callback) {
        let db = new sqlite3.Database(database);
        let news = [];
        let sql = 'select * from NEWS ORDER BY ID DESC';

        db.all(sql, [], (err, row) => {
            if (err) {
                throw err;
            }

            row.forEach((row) => {
                var notizie = {};
                notizie.titolo = row.TITOLO;
                notizie.testo = row.TESTO;
                notizie.data = row.DATA;

                news.push(notizie)
            });

            callback(news)
        });

        db.close();
    },

    setNotizie: function (titolo, testo, data) { //callback in caso di lettura dati da un componente da inviare poi al post????
        let db = new sqlite3.Database(database);
        let sql = `INSERT INTO NEWS(TITOLO,TESTO,DATA) VALUES(?,?,?)`;
        db.run(sql, [titolo, testo, data], function (err) {
            if (err) {
                throw err;
                console.log('errore di connessione al db');
            }

            console.log('inserimento dati corretto');
        });
        db.close();
    },

    setProgrammati: function (nomePz, cognomePz, prestazione, inizio, fine, indirizzoPartenza, indirizzoArrivo) {
        let db = new sqlite3.Database(database);

        let sql = `INSERT INTO PROGRAMMATI(NOMEPZ,COGNOMEPZ,PRESTAZIONE,INIZIO,FINE,INDIRIZZOP,INDIRIZZOA) VALUES(?,?,?,?,?,?,?)`;

        db.run(sql, [nomePz, cognomePz, prestazione, inizio, fine, indirizzoPartenza, indirizzoArrivo], function (err) {
            if (err) {
                throw err;
                console.log('dati non inseriti');
            }

            console.log('inserimento dati corretto');
        });
        db.close();
    },

    getRichieste: function (callback) {
        let db = new sqlite3.Database(database);
        let richieste = [];
        let richieste2 = [];
        let richieste3 = [];
        let courses = [];
        let sql = `SELECT * FROM PROGRAMMATI`;
        let sql2 = `SELECT * FROM EVENTO`;
        let sql3 = `SELECT * FROM TAXI`
        let sql4 = `SELECT * FROM COURSE`

        db.all(sql, [], (err, row) => {
            if (err) {
                throw err;
            }

            row.forEach((row) => {
                var dati = {};
                dati.nome = row.NOMEPZ;
                dati.cognome = row.COGNOMEPZ;
                dati.prestazione = row.PRESTAZIONE;
                dati.oraInizio = row.INIZIO;
                dati.oraFine = row.FINE;
                dati.partenza = row.INDIRIZZOP;
                dati.destinazione = row.INDIRIZZOA;

                richieste.push(dati);
            });
        });

        db.all(sql2, [], (err, row) => {
            if (err) {
                throw err;
            }

            row.forEach((row) => {
                var dati2 = {};
                dati2.evento = row.TIPOLOGIA;
                dati2.luogo = row.LUOGO;
                dati2.indirizzo = row.INDIRIZZO;
                dati2.oraInizio = row.INIZIO;
                dati2.oraFine = row.FINE;

                richieste2.push(dati2);
            });
        });

        db.all(sql3, [], (err, row) => {
            if (err) {
                throw err;
            }

            row.forEach((row) => {
                var dati3 = {};
                dati3.nome = row.NOMEPZ;
                dati3.cognome = row.COGNOMEPZ;
                dati3.partenza = row.INDIRIZZOP;
                dati3.destinazione = row.INDIRIZZOA;
                dati3.oraInizio = row.INIZIO;
                dati3.oraFine = row.FINE;

                richieste3.push(dati3);
            });
        });

        db.all(sql4, [], (err, row) => {
            if (err) {
                throw err;
            }

            row.forEach((row) => {
                var dati4 = {};
                dati4.Id = row.ID;
                dati4.nomeCorso = row.NOMEC;
                dati4.istruttore = row.ISTRUTTORE;
                dati4.inizio = row.INIZIO;
                dati4.requisiti = row.REQUISITI;
                dati4.descrizione = row.DESCRIZIONE;

                courses.push(dati4);
            });

            callback(richieste, richieste2, richieste3, courses)
        });

        db.close();
    },

    setEvento: function (tipologia, luogo, indirizzo, inizio, fine) {
        let db = new sqlite3.Database(database);

        let sql = `INSERT INTO EVENTO(TIPOLOGIA,LUOGO,INDIRIZZO,INIZIO,FINE) VALUES(?,?,?,?,?)`;

        db.run(sql, [tipologia, luogo, indirizzo, inizio, fine], function (err) {
            if (err) {
                throw err;
                console.log('dati non inseriti');
            }

            console.log('inserimento dati corretto');
        });
        db.close();
    },

    setTaxi: function (nomePz, cognomePz, inizio, fine, indirizzoPartenza, indirizzoArrivo) {
        let db = new sqlite3.Database(database);

        let sql = `INSERT INTO TAXI(NOMEPZ,COGNOMEPZ,INIZIO,FINE,INDIRIZZOP,INDIRIZZOA) VALUES(?,?,?,?,?,?)`;

        db.run(sql, [nomePz, cognomePz, inizio, fine, indirizzoPartenza, indirizzoArrivo], function (err) {
            if (err) {
                //throw err;
                console.log('dati non inseriti');
            }

            console.log('inserimento dati corretto');
        });
        db.close();
    },

    setCourse: function (nomeCorso, istruttore, inizio, requisiti, descrizione) {
        let db = new sqlite3.Database(database);
        let sql = `INSERT INTO COURSE(NOMEC, ISTRUTTORE, INIZIO, REQUISITI, DESCRIZIONE) VALUES (?,?,?,?,?)`;
        db.run(sql, [nomeCorso, istruttore, inizio, requisiti, descrizione], function (err) {
            if (err) {
                console.log("Dati non inseriti");
            };

            console.log("Dati Inseriti");
        });
        db.close();
    },

    getCourse: function (callback) {
        let db = new sqlite3.Database(database);
        let course = [];
        let sql = 'select * from COURSE';

        db.all(sql, [], (err, row) => {
            if (err) {
                throw err;
            }

            row.forEach((row) => {
                var list = {};
                list.nomeCorso = row.NOMEC;
                list.istruttore = row.ISTRUTTORE;
                list.inizio = row.INIZIO;
                list.requisiti = row.REQUISITI;
                list.descrizione = row.DESCRIZIONE;

                course.push(list)
            });

            callback(course)
        });

        db.close();
    },

    delCourse: function(id) {
        let db = new sqlite3.Database(database);
        let sql = `DELETE FROM COURSE WHERE ROWID=?`

        db.run(sql,[id], function(err) {
            if (err) {
                consol.log('Dati non cancellati');
            };

            console.log('Dati canellati');
        });
        db.close();
    }
}