import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import directoryRoutes from "./routes/directoryRoutes.mjs";
import fileRoutes from "./routes/fileRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import checkAuth from "./middlewares/authMiddleware.js";

try {
  await connectDB();

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use((req, res, next) => {
    if (req.method === "GET" || req.method === "POST" && req.url.startsWith("/file")) {
      return next();
    }

    return express.json()(req, res, next);
  });

  app.use("/directory", checkAuth, directoryRoutes);
  app.use("/file", checkAuth, fileRoutes);
  app.use("/user", userRoutes);

  app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong!" });
  });

  app.listen(3000, () => {
    console.log("server running on 3000 port");
  });

} catch (error) {
  console.log('Could not connect to database')
  console.log(error);
}
