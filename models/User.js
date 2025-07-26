const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true},
    password: { type: String, required: true }, // Hashed password
}, {timestamps: true});

// hash password before saving it
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// helper method to compare passwords for login
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

// hide password when sending JSON
userSchema.set("toJSON", {
    transform: function(doc, ret) {
        delete ret.password;
        return ret;
    },
});

module.exports = mongoose.model("User", userSchema);