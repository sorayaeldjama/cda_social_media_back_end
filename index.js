import express from "express";
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import postRoutes from "./routes/posts.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import relationshipRoutes from "./routes/relationships.js";
import updateRoutes from "./routes/users.js";
import getAllUsersExceptCurrentRoutes from"./routes/users.js"
const app = express();

//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
app.use(express.json());

// pour le local 
app.use(
  cors({
    origin: "http://localhost:3000", 
  })
);

// pour le deploiement en ligne
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || /https:\/\/.*\.vercel\.app/.test(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// };

// app.use(cors(corsOptions));


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../front/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  const upload = multer({ storage: storage });


  app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
  });

  app.use(cookieParser());
  

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/comments",commentRoutes)
app.use("/api/likes",likeRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/relationships", relationshipRoutes);
app.use("/api/update", updateRoutes);
app.use("/api/allUsers", getAllUsersExceptCurrentRoutes);




app.listen(8900,()=>{
    console.log("API working");
});