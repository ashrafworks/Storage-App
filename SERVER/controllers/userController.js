import { startSession, Types } from "mongoose";
import Directory from "../models/DirectoryModel.js";
import User from "../models/UserModel.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const dirId = new Types.ObjectId();
  const userId = new Types.ObjectId();
  const session = await startSession();
  try {
    const foundUser = await User.findOne({ email: email });
    console.log(foundUser);
    if (foundUser) {
      return res.status(409).json({
        error: "User already exists",
        message:
          "A user with this email address already exists. Please try logging in or use a different email.",
      });
    }

    session.startTransaction();

    await Directory.create([{
        _id: dirId,
        name: `root-${email}`,
        userId,
      }], {session});

    await User.create([{
      _id: userId,
      name,
      email,
      password,
      rootDirId: dirId,
    }], {session});

    session.commitTransaction();

    res.cookie("uid", userId.toString(), {
      httpOnly: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });

    return res.json({ message: "user register successfully" });

  } catch (error) {
    session.abortTransaction();
    if(error.code === 121) {
      console.log({error: error.errInfo.details.title})
      return res.status(400).json({error: 'Invalid input enter a valid input fields'});
    }
    console.log(error)
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({email: email}).lean();

  if (!user || user.password !== password) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  res.cookie("uid", user._id.toString(), {
    httpOnly: true,
    maxAge: 60 * 1000 * 60 * 24 * 7,
  });

  res.json({ message: "logged in user successfully" });
};

export const getUser = (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
  });
};

export const logout = (req, res) => {
  res.clearCookie("uid");
  res.status(204).end();
};