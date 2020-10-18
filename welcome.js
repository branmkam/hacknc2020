//REQUIREMENTS
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var express = require('express');
const path = require('path');
const cp = require('child_process');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', express.static('static'));

/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
var uri = "mongodb+srv://branmkam:OYjflHM6oniRWBYZ@hacknc2020.ttvst.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function connect() {
    await client.connect();
}
connect();

 // --- LIST OF LINKS ---
 app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "welcome.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get('/signup', (req, res) => {
   res.sendFile(path.join(__dirname, "signup.html"));
});

app.get('/log', async (req, res, next) => {
        try {
            res.redirect("/login");
        }
         catch (err) {
            res.status(500).send({ message : err.message });
        }
        client.close();
});

app.get('/sign', async (req, res, next) => {
    try {
        res.redirect("/signup");
    }
     catch (err) {
        res.status(500).send({ message : err.message });
    }
    client.close();
});

// -- listen to port --
const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});