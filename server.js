const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

let port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/fetch_user_info',(req,res) => {
    fs.readFile(`info/${req.query.id}.json`,'utf-8',(err,data) => {
        res.json(data);
    });
});

app.get('/fetch_event_data',(req,res) => {
    fs.readdir(`event_db/${req.query.id}`,(err,files) => {
        if (err) throw err;

        let promises = [];

        for (file of files){
            promises.push(fetch_event_data(req.query.id,file))
        }

        Promise.all(promises)
        .then((events) => {
            res.json(events);
        })
        .catch((err) => {
            res.send(null);
        })
    });
});

app.post('/add_event',(req,res) => {
    let userID = req.query.id;
    let eventInfo = req.body;
    add_event(userID,eventInfo)
    .then((value) => {
        res.send('Evento adicionado com sucesso');
    })
    .catch((value) => {
        res.status(500).send('Não foi possível adicionar o evento ao servidor');
    });
});

app.listen(port,() => {
    console.log('Server Started');
});

function fetch_event_data(iduser,eventfile){
    return new Promise ((resolve,reject) => {
        fs.readFile(`event_db/${iduser}/${eventfile}`,'utf-8',(err,data) => {
            if (err) reject(null);
            else resolve(JSON.parse(data));
        });
    });
}

function add_event(userID,eventInfo){
    return new Promise((resolve,reject) => {
        let new_event_file = `event_db/${userID}/${generateID()}.json`;
        fs.writeFile(new_event_file,JSON.stringify(eventInfo),'utf-8',(err) => {
            if (err) reject(false);
            else resolve(true);
        });
    });
}

function generateID () {
    return '_' + Math.random().toString(36).substr(2, 9);
};
