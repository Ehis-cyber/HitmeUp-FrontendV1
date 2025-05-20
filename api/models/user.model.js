import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        unique: false,
    },
    lastname: {
        type: String,
        required: true,
        unique: false,
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
    UserType: {
        type: String,
        required:true,
        enum: ["Tasker", "Client"],
    },
    isVerified: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
},
{

        timestamps: true,
 
});

export default mongoose.model("User", userSchema);