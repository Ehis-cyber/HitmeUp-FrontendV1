import mongoose from 'mongoose';
const { Schema } = mongoose;

const usernextSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    NIN: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: "User",
        required: true,
      },
        profilePicture: {
            type: String,
            default: "/default-profile.png",
        },
},
{

        timestamps: true,
 
});

export default mongoose.model("Usernext", usernextSchema);