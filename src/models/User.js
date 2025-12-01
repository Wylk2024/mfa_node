import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, default: null }
});

export default mongoose.model("User", userSchema);