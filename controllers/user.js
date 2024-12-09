/**
 * 1 on créé les fonctions middleware d'authentification
 * 2 on créé le router dans routes
 * 3 on importe le router dans l'application
 * 4 on importe le controller user dans le /routes.user.js
 */
// on a besoin de notre model user
const User = require("../Model/user");
/**
 * on besoin de chiffrer les mdp
 * on install bcrypt
 * npm install --save bcrypt --force (si ça ne veut pas s'installer (sauvegarde dans package.json))
 */
const bcrypt = require("bcrypt");

/**
 * Pour la gestion d'authentification on a besoin de créer un token dynamiquement
 * On install le package jsonwebtoken
 * installation npm install --save jsonwebtoken ( --force en cas d'erreur )
 */
// on importe jsonwebtoken
const jwt = require("jsonwebtoken");

exports.signup = (req, resp, next)=>{
    // fonction asynchrone        // 10 tours de hashage
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        // on save notre user en BDD
        user.save()
        .then(() => resp.status(201).json({ message: "utilisateur créé <3"}))
        .catch(error => resp(400).json({error}));
    })
    // erreur serveur
    .catch(error => resp.status(500).json({error}))
}

exports.login = (req, resp, next)=> {
    User.findOne({email : req.body.email})
    .then(user => {
        // on vérifie si l'utilisateur a été trouvé
        if(!user) {
            // s'il n'existe pas ( ne jamais préciser explicitement que l'utilisateur n'existe pas)
            // 401 status non autorisé
            resp.status(401).json({ message : "identifiant / mot de passe incorrects"})
        } else {
            // s'il existe on compare entre ce qui est transmi et ce qui est en BDD
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    // si le mot de passe n'est pas bon ( pareil, ne pas préciser )
                    resp.status(401).json({ message: "identifiant / mot de passe incorrects"})
                } else {
                    resp.status(200).json({
                        // on envoi un ojb avec les info nécéssaires à l'authentification des reqûtes
                        userId: user._id,
                        /**
                         * on veut encoder des données ( payload ) dans ce token
                         * 
                         */
                        token: jwt.sign( 
                            /**
                             * en encodant le userId on est sure que la requête correspond à ce userId
                             * aussi quand je créé un nouvel objet, je suis sûre qu'il ne poura pas être
                             * modifié par un autre utilisateur que mon userId
                             */
                            { userId : user._id }, 
                            // Clé secrète pour l'encodage ( mettre une chaîne de caractère longue en prod pour la sécu) 
                            "RANDOM_USER_TOKEN",
                            { expiresIn: "24h" }
                        )
                    });
                }
            })
            .catch(error => resp.status(500).json({ error }));
        }   
    })
    .catch(error => resp.status(500).json({ error }))
}