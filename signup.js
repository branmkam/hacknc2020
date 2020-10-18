//REQUIREMENTS
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var express = require('express');
const path = require('path');
const app = express();
var url = require('url');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

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

//webpage links


 app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

//-----------------------------

 //SIGNUP MECHANICS
app.get('/signup', async (req, res) => {
        //DO SERVER-SIDE CODE HERE
        try {
           if(hasName(client, req.query.penName) == null)
           {
                var newUser = await addNewUserHalf(client, req.query.penName, req.query.password, req.query.email, req.query.lang);
                console.log(newUser);
                res.redirect
            }
            else
            {
                res.redirect('/');
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

async function addNewUserHalf(client, pen, pw, email, lang){
        
    //add to private server - half of info bc interests are on next webpage
    var db = await client.db("private-server").collection("users");
    var toInsert = 
    {
        penName : pen,
        pw : pw,
        email : email,
        language : lang
    }
    try {
        await db.insertOne(toInsert);
    } catch {
    }

    db = await client.db("public").collection("users");
    var toInsert = 
    {
        penName : pen,
        email : email,
        language : lang
    }
    try {
        await db.insertOne(toInsert);
        return toInsert;
    } catch {
        return null;
    }
};

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

async function hasName(client, name)
{
    var db = await client.db("private-server").collection("users");
    try {
        var query = {penName : name};
        var q = await db.findOne(query);
        console.log(q);
        return q;
    } catch {
        return null;
    }
}