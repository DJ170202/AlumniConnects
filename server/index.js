import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import {register} from './controllers/auth.js';
import authRoutes from './routes/auth.js' ;
//fileURLToPath decodes the file URL to a path string and ensures that the URL control characters are properly adjusted.
//example - https://www.geeksforgeeks.org/node-js-url-fileurltopath-api/
import { fileURLToPath } from "url";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
//manually injecting the information.
import User from "./models/User.js";
import Post from "./models/Post.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
//Below line is going to set our directory where we'll keep our assets - Images.
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  //destination - jab hum file upload karenge to wo "public/assets" me jaake store hogi.
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "public/assets"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
});
//This will help us save our upload. So at anytime when we need to upload files we will use variable `upload`.
const upload = multer({ storage });

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register);/*Here upload is a middleware and single() specifies that only one file will be uploaded with the name picture*/
app.post("/posts", verifyToken, upload.single("picture"), createPost);
/*ROUTES*/
app.use("/auth", authRoutes);//this will help us keep our routes(files) organized. Yahan pe '/auth' acts as prefix to all authRoutes such as /login => '/auth/login'
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* Static files for building Deployment ke time pe add kiya h bro.*/
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function(req, res){
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

/* Mongoose setup */
//take PORT listed in .env file and in case if it does not work then, 6001 pe chalega.
const PORT = process.env.PORT ||6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser :true,
    useUnifiedTopology:true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));    
}).catch((error) => console.log(`${error} did not connect`));

