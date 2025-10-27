import { startSession, Types } from "mongoose";
import { connectDB } from "./config/db.js";
import Directory from "./models/DirectoryModel.js";
import User from "./models/UserModel.js";

await connectDB();

// const data = await User.findOne({_id: '68f7b91eb5cd343fd1ffd31f'});
// console.log(data)
let session;
try {
  session = await startSession();

  const userId = new Types.ObjectId();
  const dirId = new Types.ObjectId();

  session.startTransaction();

  const insertUser = await User.findByIdAndDelete('68fe4c048e2ed3070ca8717f');
console.log(insertUser)
  const insertUserdirectory = await Directory.findByIdAndDelete('68fe4c048e2ed3070ca87180');
console.log(insertUserdirectory)
  session.commitTransaction();
} catch (error) {
  session.abortTransaction();
  console.log(error);
  // console.log(error..errInfo.details)
}
