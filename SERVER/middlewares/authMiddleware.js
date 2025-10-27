import { ObjectId } from "mongodb";
import User from "../models/UserModel.js";

export default async function checkAuth(req, res, next) {
  const { uid } = req.cookies;

  try {
    const user = await User.findOne({ _id: uid });
    req.user = user;
    // console.log({objectid: new ObjectId(uid)})
    if (!uid || !user) {
      return res.status(401).json({ message: "Not logged in" });
    }
  } catch (error) {
    console.log(error.message);
  }

  next();
}
