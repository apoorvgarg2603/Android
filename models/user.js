var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
UserSchema.plugin(passportLocalMongoose);       // Adding services by passport to our UserSchema
module.exports = mongoose.model("User", UserSchema);