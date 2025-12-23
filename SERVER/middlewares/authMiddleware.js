import Session from "../models/SessionModel.js";
import User from "../models/UserModel.js";

export default async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;

  if (!sid) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const session = await Session.findOne({ _id: sid });

    if(!session) return res.status(401).json({ message: "your login session expire please login again" });
    req.session = session;
    const user = await User.findOne({_id: session.userId});

    if (!user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    req.user = user;

    next();
    
  } catch (error) {
    console.log(error.message);
  }
}
