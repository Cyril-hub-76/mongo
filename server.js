// import du paquet http de Node
const http = require("http");
// on importe l'application
const app = require("./app");

const normalizePort = val => {

    const port = parseInt(val, 10);

    if(isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || '3000');

// on indique à notre application sur quel port écouter
app.set("port", port);

const errorHandler = error => {
    if (error.syscall !== "listen"){
        throw error;
    }

    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port" + port;

    switch(error.code){
        case "EACCES":
            console.error(`${bind} requires elevated privieges.`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is aldeady in use.`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// accès à l'objet http qui créé le serveur
// on passe en paramètre notre application
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", ()=>{
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port" + port;
    console.log("Listening on " + bind);
})

server.listen(port);

/**
 * Pour que le serveur se mette à jour lorsqu'un fichier change, 
 * on utilisera nodemon qui doit être installé dans le projet.
 * installation:
 * npm install -g nodemon
 * 
 * lancer le serveur:
 * dossier backend
 * nodemon server
 * 
 * lancer le front
 * dossier frontend
 * npm start
 */