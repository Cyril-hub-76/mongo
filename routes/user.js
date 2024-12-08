const express = require("express");
// création du router
const router = express.Router();
// import du controller pour y associer les fonctions
const userController = require("../controllers/user");

// on créé nos routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
module.exports = router;