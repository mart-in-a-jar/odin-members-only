import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
const { isEmail, isStrongPassword } = validator;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: "Invalid email",
        },
        maxLength: 50,
    },
    password: {
        type: String,
        required: true,
        maxLength: 100,
        validate: {
            validator: isStrongPassword,
            message:
                "Passwords must be at least 8 characters and include at least one of the following: uppercase character, lowercase character, number and symbol",
        },
    },
    firstname: {
        type: String,
        maxLength: 50,
        minLength: 2,
        required: true,
    },
    lastname: {
        type: String,
        maxLength: 50,
        minLength: 2,
        required: true,
    },
    admin: {
        type: Boolean,
    },
    member: {
        type: Boolean,
    },
});

UserSchema.pre("save", async function (next) {
    // Hash password
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);

        this.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.virtual("name").get(function () {
    return `${this.firstname} ${this.lastname}`;
});

const model = mongoose.model("users", UserSchema);
export default model;
