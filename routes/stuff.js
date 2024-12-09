const express = require("express");
// On créé notre router express qui permet de créer des routeurs séparés pour chaque route principale de l'application
const router = express.Router();
// on importe notre middleware d'authentification
const auth = require("../middleware/auth");
// on importe le controller pour gérer les things
const thingsController = require("../controllers/stuff");
// on importe multer
const multer = require("../middleware/multer_config");

// route create
router.post("/", auth, multer, thingsController.createThing);
// route read
router.get("/:id", auth, thingsController.readThing);
// route update
router.put("/:id", auth, multer, thingsController.modifyThing);
// route delete
router.delete("/:id", auth, thingsController.deleteThing);
// tous les objets ( things )
router.get("/", thingsController.getAllThings);

module.exports = router;

/**
 * On appel notre middleware auth avant le gestionnaire de routes
 * pour assurer l'authentification
 * 
 * On ajouter la gestion des fichiers dans createThing 
 * APRES la vérification du token
 */