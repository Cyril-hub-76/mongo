/**
 * Pour la gestion de fichiers envoyé via une requête http,
 * un utilise le package multer
 * installation npm install --save (--force) multer
 */

/**
 * On créé un middleware qui configure multer afin de savoir
 * où enregistrer les fichiers et comment les nommer
 */
// import de multer
const multer = require ("multer");
// création du dictionnaire de mimetypes
const MIME_TYPES_DICTIONARY = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png",
    "image/webp": "webp"
}
// objet de conf pour multer
const storage = multer.diskStorage({
    // ici on indique à multer où enregistrer les fichiers
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    // on indique à multer quel nom utiliser pour le nommage
    filename: (req, file, callback) =>{
        /**
         * on se sert du nom originale du fichier et on
         * y enlève les espaces pour les remmplacer par
         * des underscores, ce qui évitera les erreurs
         * sur certains Os.
         */
        const name = fic.originalname.split(" ").join("_");        
        // on utilise les mimetypes du fichier pour générer l'extension du fichier
        const extension = MIME_TYPES_DICTIONARY[file.mimetype];
        // on se sert du callback pour créer le nom du fichier
        callback(`${null}, name${Date.now()}.${extension}`);
    }
})

// export
module.exports = multer({ storage }).single("images");