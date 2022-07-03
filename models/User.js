import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    dob: {
        type: Object,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    userPhoto: Object
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);