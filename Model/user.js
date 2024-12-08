const mongoose = require("mongoose");
// import de mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");
// table des users
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
// on applique le mongoose-unique-validator au schema avant l'export
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

/**
 * Pour gérer les mails uniques on install 
 * mongoose-unique-validator...
 * npm install mongoose-unique-validator
 */