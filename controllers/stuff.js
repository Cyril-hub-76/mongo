/**
 * Le contrôleur exporte des méthodes qui sont ensuite attribuées 
 * aux routes pour améliorer la maintenabilité de notre application.
 */

const Thing = require("../Model/thing");

// ici, une requête POST sur l'endpoint /api/stuff
exports.createThing = (req, resp, next)=> {
    /**
     * Avec multer, le corps de la requête change.
     * Nous devons envoyer les donnés de la requête au forma form-data
     * Ici, c'est un objet au format string, il faut donc le parser.
     */
    const thingObject = JSON.parse(req.body.thing);
     /**
      * on supprime le champ _id car l'id est généré par la BDD
      * on supprime le champ _userId pour utiliser le userId qui vient
      * du token afin d'éviter les tentatives de création d'un objet avec
      * son token mais avec le usedId de quelqu'un d'autre.
      */
     delete thingObject._id;
     delete thingObject._userId;
     // on créé notre thing
     const thing = new Thing( {
        /**
         * spread operator permet de faire une copie de tous les éléménents 
         * de req.body
         */
        ...thingObject,
        userId: req.auth.userId,
        /** 
         * Sinon, on il aurait fallut l'écrire comme ceci:
         * 
         * title: req.body.title,
         * description: req.body.description,
         * imageUrl: req.body.imageUrl,
         * price: req.body.price,
         * userId: req.body.userId
        */
       // on doit gérer la création de l'url
       //             v                   v                  v          v
       //        protocol http         localhost       destination   nom retourné pas multer     
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
     });
     // On enregistre le nouvel objet en base
     thing.save()
     /**
      * Ne pas oublier d'envoyer le status sinon bug!
      * pour une création, le satus est 201
      */
     .then(() => {resp.status(201).json({ message : "Objet en registré avec succès!"})})
     .catch(error => resp.status(400).json({error}));
};

// ici on modifie l'objet thing
exports.modifyThing = (req, resp, next) => {
    /**
     * on vérifie s'il y a un champ file dans la requête
     * si c'est le cas, onrécupère l'objet et on parse la chaine de caractère
     * sinon on récupère directement l'objet dans le coprs de la requête.
     */
    const thingVerify = req.file ? {
        ...JSON.parse(req.body.thing),
        // on recréé l'url de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : {...req.body};
        // on supprime le userId
        delete thingVerify._userId;

        Thing.findOne({_id: req.params.id})
        .then((thing) => {
            // on vérifie si c'est le propriétaire de l'objet qui fait la requête de modif
            if(thing.userId != req.auth.userId) {
                // ici l'utilisateur cherche à modifier un obje qui ne lui appartient pas
                resp.status(401).json({ message: "Non autorisé"})
            } else {
            // c'est le bon utilisateur
            // updateOne permet de modifier l'objet
            // id envoyé en paramètre de requête // ici le thing du corps de la requête, on dit que l'id doit correspondre à celui de la requête
            //                         v                     v
               Thing.updateOne({_id: req.params.id}, {...thingVerify, _id: req.params.id})
               .then(()=> resp.status(200).json({message : "Objet modifié avec succès"}))
               .catch((error) => resp.status(401).json({error})) 
            }
        })
        .catch((error) => resp.status(400).json({error}));
    };
                      
// ici on supprime un thing
exports.deleteThing = (req, resp, next) => {
    Thing.deleteOne({ _id: req.params.id })
    .then(() => resp.status(200).json({ message: "Objet supprimé avec susccès" }))
    .catch(error => resp.status(404).json({error}));
};

// ici on lit un thing précis
// la route sera dynamique grâce au ":"
exports.readThing = (req, resp, next) =>{
    // la méthode findOne récupère l'objet sélectionné
    // qui possède le même _id que dans le paramètre
    // de la requete 
    Thing.findOne({ _id: req.params.id })
    // promise
    .then(thing => resp.status(200).json(thing))
    .catch(error => resp.status(404).json({error}));
};

// Ici, une requête GET sur l'endpoint /
// nous affiche tous les things ( objets )
exports.getAllThings = (req, resp, next)=> {
    Thing.find()
    .then(things => resp.status(200).json(things))
    .catch(error => resp.status(400).json({ error }));
};

/**
 * L'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ_id . 
 * Utiliser ce mot-clé générerait une erreur, car nous tenterions de modifier un champ immuable dans un document de la base de données. 
 * Par conséquent, nous devons utiliser le paramètre id de la requête pour configurer notre Thing avec le même _id qu'avant.
 */