import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'user name is required'],
        minlength: [3, 'name must be at least 3 characters long'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator(val) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
            },
            message: 'Please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    rootDirId: {
        type: Schema.ObjectId,
        required: [true, 'rootDirId is required'],
    },
},
{
    strict: 'throw',
    timestamps: true,
}
);


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    
    next();
});

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
}


const User = model('User', userSchema);
export default User;