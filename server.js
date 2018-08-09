// ##DORIAN##
// Constantes
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const signale = require('signale');

// Chemin d"accès absolu (répertoire à partir duquel vous lancez votre processus node.js)
app.use(express.static(__dirname));
// Interprète en JSON (parseur) afin qu"Express.js puisse exploiter les données reçus
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ##LÉO##
// Déclare le moteur de template comme étant Pug, permet de ne plus avoir à indiquer l'extension des pages en ".pug"
app.set("view engine", "pug");

// Routes
app.get("/", function(req, res) { // Page d'accueil
    res.render("index", {
        title: "Accueil", // Variables 
        message: "Commencez à discuter !",
        url: "authentification"
    });
});

app.get("/authentification", function(req, res) { // Page d'authentification
    res.render("authentification", {
        title: "Authentification", // Variables
        message: "Accueil",
        url: "/"
    });
})

app.get("/tchat", function(req, res) { // Page du tchat
    res.render("tchat", {
        title: "Tchat", // Variables
        message: "Quitter",
        url: "authentification"
    });
})

app.get("/problematiques", function(req, res) { // Page des problématiques
    res.render("problematiques", {
        title: "Problématiques recontrées", // Variables
        message: "Accueil",
        url: "/"
    });
})

// ##DORIAN##
// Demande à Mongoose d'utiliser la propriété Promise (traitement asynchrone des requêtes)
mongoose.Promise = Promise;

// ##LÉO##
// Remplacer "mongo://localhost/tchat" par "mongodb://admin:admin@ds014578.mlab.com:14578/marshmallow" pour se connecter à la base de données en ligne
mongoose.connect("mongodb://admin:admin@ds247759.mlab.com:47759/marshmongo", (err) => {
    signale.success("Connexion établie avec la base de données");
});

// ##DORIAN##
// Création d"un modèle Mongoose pour les messages 
var Chats = mongoose.model("Chats", {
    chat: String,
    pseudo: String,
    // ##BENJAMIN##
    heure: String
});

// Récupère le message envoyé par l"utilisateur
app.post("/chats", async(req, res) => {
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200) // Code HTTP 200 : succès de la requête 
        io.emit("chat", req.body) // Transmet le message aux autres utilisateurs
    } catch (error) {
        res.sendStatus(500) // Code HTTP 500 : erreur serveur
        console.error(error)
    }
});

// Détecte si le message a bien été envoyé
app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        res.send(chats)
    })
});

// On lance sur le serveur sur le port 3020
var server = http.listen(3020, () => {
    signale.start("Le serveur écoute sur le port", server.address().port)
});
