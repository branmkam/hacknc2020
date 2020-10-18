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

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
});

// ---- REDIRECTS ---
app.get('/log', async (req, res, next) => {
        try {
            res.redirect("/login");
        }
         catch (err) {
            res.status(500).send({ message : err.message });
        }
});

app.get('/sign', async (req, res, next) => {
    try {
        res.redirect("/signup");
    }
     catch (err) {
        res.status(500).send({ message : err.message });
    }
});

app.get('/newuser', async (req, res, next) => {
    res.sendFile(path.join(__dirname, "chat.html"));
});

// -- login mechanics --
app.get('/login', async (req, res, next) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get('/index', async (req, res) => {
    //from login
    try {
        var user = await findPrivateEmail(req.query.email);
                console.log(user);
                if(user != null || user != undefined)
                {
                    if(req.query.password == user.pw)
                    {  
                        res.sendFile(path.join(__dirname, "chat.html"));                    
                    }
                    else
                    {
                        return res.redirect('/login');
                    }
                }
                else
                {
                    return res.redirect('/login');
                }
            }
    catch (err) {
        res.status(500).send({ message : err.message });
    }
});


// -- signup mechanics --
app.get('/signup', async (req, res) => {
    //DO SERVER-SIDE CODE HERE
    res.sendFile(path.join(__dirname, "signup.html"));
});


app.get('/interests', async (req, res) => {
    //from signup
    res.sendFile(path.join(__dirname, "interests.html"));
    try {
        var name = await hasName(req.query.penName);
       if(name == null)
       {
            var newUser = await addNewUserHalf(req.query.penName, req.query.password, req.query.email, req.query.lang);
            console.log(newUser);
            loaded = false;
            res.end();
        }          
    }
    catch (err) {
        loaded = false;
        res.status(500).send({ message : err.message });
    }
});
// -- CRUD methods --


//returns null if nothing found
async function findPrivateEmail(e){
    var db = client.db("private-server").collection("users");
    var query = {email : e};
    try {
        return await db.findOne(query);
    } catch {
        return null;
    }
}

async function hasName(name)
{
    var db = await client.db("private-server").collection("users");
    try {
        var query = {penName : name};
        var q = await db.findOne(query);
        console.log(q);
        return q;
    } catch {
        return "no user found";
    }
}

async function addNewUserHalf(pen, pw, email, lang){
        
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

// -- listen to port --
const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});