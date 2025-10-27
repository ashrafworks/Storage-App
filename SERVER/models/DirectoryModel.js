import mongoose, { model, Schema } from "mongoose";

const directorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'directory name is required'],
        trim: true,
    },
    userId: {
        type: Schema.ObjectId,
        required: [true, 'userId is required'],
    },
    parentDirId: {
        type: Schema.ObjectId,
        default: null,
    },
}, {
    timestamps: true,
    strict: 'throw',
});

const Directory = model('Directory', directorySchema, 'directories');
export default Directory;