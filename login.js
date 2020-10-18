//REQUIREMENTS
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var express = require('express');
const path = require('path');
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

 //LOGIN MECHANICS
 app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

app.get('/login', async (req, res, next) => {
        try {
            var user = await findPrivateEmail(client, req.query.email);
                    console.log(user);
                    if(user != null || user != undefined)
                    {
                        if(req.query.password == user.pw)
                        {
                            return res.redirect("/home.html");        
                        }
                        else
                        {
                            res.send("Incorrect pw");
                        }
                    }
                    else
                    {
                        res.send("Incorrect email");
                    }
                }
         catch (err) {
            res.status(500).send({ message : err.message });
        }
        client.close();
});


const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});

//returns null if nothing found
async function findPrivateEmail(client, e){
    var db = client.db("private-server").collection("users");
    var query = {email : e};
    try {
        return await db.findOne(query);
    } catch {
        return null;
    }
}