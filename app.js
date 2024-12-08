// import d'express. C'est le cœur de l'application
// installation npm install express --save pour l'importer en même temps dans package.json
const express = require("express");
// import de mongoose
const mongoose = require("mongoose");
const uri = "mongodb+srv://mongoUser:iysWCCum0vEh2LTB@cluster0.xvtfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// on importe les routers
const stuffRouter = require("./routes/stuff");
const userRoutes = require ("./routes/user");
// notre application
const app = express();
// on importe path
const path = require('path');
mongoose.connect(uri,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// ** section middleware **

// middleware qui intercepte tous les contentype/json et
// met à disposition le contenu sur l'objet req.body
app.use(express.json());

// Le CORS définit comment les serveurs et les navigateurs interagissent, 
// en spécifiant quelles ressources peuvent être demandées de manière légitime – 
// par défaut, les requêtes AJAX sont interdites.

// Middleware générale qui s'applique à toutes les routes
// La méthode app.use() nous permet d'attribuer un middleware à une route spécifique de notre application. app.use intercepte toutes les
// requêtes d'un endpoint
app.use((req, resp, next)=>{
    // On permet à tout le monde d'accéder à notre application
    resp.setHeader("Access-Control-Allow-Origin", "*");
    // Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse.
    resp.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    // on accepte les méthodes
    resp.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPIONS");
    next();
});

// on utilise les routes contenue dans ce router
app.use("/api/stuff", stuffRouter);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
// export de l'application
module.exports = app;