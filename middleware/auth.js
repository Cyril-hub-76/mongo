const jwt = require("jsonwebtoken");
// on exporte notre middleware
module.exports = ({req, resp, next}) => {

    try {
        /**
         *  on récupère le contenu de header authoraization
         *  on obtient le bearer et le token, il faut séparer le token
         */
        const token = req.headers.authorization.split(' ')[1];
        // on décode le token
        const decodeToken = jwt.verify(token, "RANDOM_USER_TOKEN");
        // on récupère le userId
        const userId = decodeToken.userId;
        /**
         * on ajoute le userId récupéré à l'objet req qui sera transmi
         * aux routes qui seront appleé par la suite
         */
        req.auth = {
            userId: userId
        };
        next();
    } catch {(error => resp.status(401).json({ error }))} 
}

/**
 * Nous avons besoin de récupérer le token de l'utilisateur
 * pour son authentification
 */
