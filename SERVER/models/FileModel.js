import mongoose, { model, Schema } from "mongoose";

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'directory name is required'],
        trim: true,
    },
    extname: {
        type: String,
        required: [true, 'file extension name is required'],
        trim: true,
    },
    userId: {
        type: Schema.ObjectId,
        required: [true, 'userId is required'],
    },
    parentDirId: {
        type: Schema.ObjectId,
        required: [true, 'parentDirId is required'],
    },
}, {
    timestamps: true,
    strict: 'throw',
});

const File = model('File', fileSchema);
export default File;