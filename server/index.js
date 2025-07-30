import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import AuthRoute from "./routes/auth.route.js";
import UserRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config(); //dotenv config
const app = express();

// middlewares
app.use(express.json()); //json middlewares
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL })); //cors middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //cookie middleware
app.use(helmet()); //helmet middlewares
app.use(compression()); //compression middlewares

// server database connection function
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connected succesfully🛜🛜🛜");
    // starting the server
    app.listen(process.env.PORT, (err) => {
      if (err) return console.log(err);
      console.log("Server started Succesfully 👍👍👍. ");
    });
  })
  .catch((err) => console.log(err));

// auth route
app.use("/api-auth", AuthRoute);
app.use("/api-user", UserRoute);
