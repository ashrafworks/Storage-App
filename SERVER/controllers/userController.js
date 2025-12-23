import { startSession, Types } from "mongoose";
import Directory from "../models/DirectoryModel.js";
import User from "../models/UserModel.js";
import Session from "../models/SessionModel.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const dirId = new Types.ObjectId();
  const userId = new Types.ObjectId();
  const session = await startSession();
  try {

    session.startTransaction();

    await Directory.create(
      [
        {
          _id: dirId,
          name: `root-${email}`,
          userId,
        },
      ],
      { session }
    );

    await User.create(
      [
        {
          _id: userId,
          name,
          email,
          password,
          rootDirId: dirId,
        },
      ],
      { session }
    );

    session.commitTransaction();

    return res.status(200).json({ message: "user register successfully" });

  } catch (error) {
    session.abortTransaction();
    if (error.code === 121) {
      return res
        .status(400)
        .json({ error: "Invalid input enter a valid input fields" });
    }
    else if (error.code === 11000) {
      console.log(error.keyValue);
      if (error.keyValue.email) {
        return res.status(409).json({
          error: "This email already exists",
          message:
            "A user with this email address already exists. Please try logging in or use a different email.",
        });
      }
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  const match = await user.comparePassword(password);

  if(!match) return res.status(404).json({ error: "Invalid Credentials" });

  const allSessions = await Session.find({userId: user.id}); // user.id mongoose ki functionality hai mongoose samjh jata hai
  if(allSessions.length >= 2) {
    await allSessions[0].deleteOne();
  }

  const session = await Session.create({
    userId: user._id,
  });

  res.cookie("sid", session._id.toString(), {
    httpOnly: true,
    maxAge: 60 * 1000 * 10,
    signed: true,
  });

  res.json({ message: "logged in user successfully" });
};

export const getUser = (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
  });
};

export const logout = async (req, res) => {

  await req.session.deleteOne();

  res.clearCookie("sid");
  res.status(204).end();
};

export const logoutAll = async (req, res) => {

  await Session.deleteMany({userId: req.user.id});

  res.clearCookie("sid");
  res.status(204).end();
};
