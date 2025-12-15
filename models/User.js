// D:\TravelbucketList\backend\models\User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <--- MUST BE INSTALLED (npm install bcryptjs)

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

// CRITICAL: Middleware to hash password BEFORE saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); 
    }
    
    // Hash the password
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Proceed to save
    } catch (error) {
        console.error("!!! BCRYPT HASHING FAILED IN USER MODEL !!!", error);
        next(error); // Abort save operation
    }
});

// Method for login (verified working by your successful login)
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);