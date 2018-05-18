const sqlite3 = require('sqlite3').verbose();
const databse = './sitoCri.db';

module.exports = {
    getNotizie: function(callback) {
        let db = new sqlite3.Database('./sitoCri.db');
        let news = [];
        let sql = 'select * from NEWS';

        db.all(sql, [], (err,row) => {
            if(err) {
                throw err;
            }

        row.forEach((row) => {
            var notizie = {};
            notizie.titolo = row.TITOLO;
            notizie.testo = row.TESTO;

            news.push(notizie)
        });

        callback(news)
        });

    db.close();
    },

    setNotizie: function(a,b) { //callback in caso di lettura dati da un componente da inviare poi al post????
        let db = new sqlite3.Database('./sitoCri.db');
        let news = {};
      
        let sql = `INSERT INTO NEWS(TITOLO,TESTO) VALUES(?,?)`;
        db.run(sql, [a,b], function(err){
            if(err) {
                throw err;
                console.log('errore di connessione al db')
            }

            console.log('inserimento dati corretto')
        });
    db.close();
    }
}