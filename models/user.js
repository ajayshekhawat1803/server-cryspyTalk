import mongoose from "mongoose";

export const genderOptions = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "other"
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    profilePic: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
}, { timestamps: true });

userSchema.pre("validate", async function (next) {
    if (this.isNew) {
        // Generate unique username if not provided
        if (!this.username) {
            let baseUsername = (this.firstName || "user").toLowerCase();
            let username = baseUsername;
            let counter = 1;
            while (await mongoose.models.users.findOne({ username })) {
                username = `${baseUsername}${String(counter++).padStart(3, '0')}`;
            }
            this.username = username;
        }

        // Set profilePic based on gender if not provided
        if (!this.profilePic) {
            if (this.gender === "male") {
                this.profilePic = "public/default/profilePic/male.png";
            } else if (this.gender === "female") {
                this.profilePic = "public/default/profilePic/female.png";
            } else {
                this.profilePic = "public/default/profilePic/other.png";
            }
        }
    }
    next();
});
const userModel = mongoose.model("users", userSchema);
export default userModel;