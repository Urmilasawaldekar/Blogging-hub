import express from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
const app = express();
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from  "mongoose";
import multer from 'multer';
import AdminRouter from './routes/admin.js';
import router from './routes/auth.js';
import userRoute from './routes/user.js';
import postRoute from './routes/post.js';
import commentRoute from './routes/comments.js';
import { VerifyToken } from './middleware/verifiedtoken.js';

app.use(express.json());
dotenv.config();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['set-cookie'],
};

app.use(cors(corsOptions));
app.use(cookieParser());

const ConnectDb = async () => {
  try {
    const mongoURI = process.env.MONGO_URL;
    if (!mongoURI) throw new Error('Missing MONGO_URL in environment');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connection established');
  } catch (err) {
    console.error(' DB Connection Error:', err.message);
  }
};


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/images", (req, res, next) => {
  console.log("Image request URL:", req.url);
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});
// Serve static files from images directory, disable directory listing to avoid ENOENT for index.html
app.use("/images", express.static(path.join(__dirname,"../Backend/images"), {
  fallthrough: false,
  index: false
}));

app.use((err, req, res, next) => {
  if (err) {
    console.error("Static file serving error:", err);
    res.status(err.status || 500).send(err.message);
  } else {
    next();
  }
});
console.log(cors());
app.use(cookieParser());


app.use('/api/auth',router)
app.use('/api/admin',AdminRouter)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)
// app.use('/images', express.static(path.join(__dirname, 'public/images')));

///upload img 
const imagesDir = path.resolve(__dirname, '../Backend/images');

// import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    try {
      console.log(`Checking if images directory exists at ${imagesDir}`);
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        console.log(`Created images directory at ${imagesDir}`);
      } else {
        console.log(`Images directory already exists at ${imagesDir}`);
      }
      fn(null, imagesDir);
    } catch (err) {
      console.error('Error ensuring images directory exists:', err);
      fn(err);
    }
  },
  filename: (req, file, fn) => {
    try {
      const originalName = file.originalname;
      const sanitized = Date.now() + '_' + originalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\.-]/g, '');
      console.log(`Saving file as ${sanitized}`);
      fn(null, sanitized);
    } catch (err) {
      console.error('Error generating filename:', err);
      fn(err);
    }
  }
});
import exifParser from 'exif-parser';

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log("Upload route called");
  console.log("Uploaded file info:", req.file);
  if (!req.file) {
    console.error("No file uploaded in request");
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = req.file.path;
  console.log("File path on disk:", filePath);

  // Verify file exists after upload
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Uploaded file not found on disk:", filePath);
      return res.status(500).json({ message: "Uploaded file not found on disk" });
    }

    // Read file buffer
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error reading uploaded file:", err);
        return res.status(500).json({ message: "Error reading uploaded file" });
      }
      try {
        // Parse EXIF data
        const parser = exifParser.create(data);
        const result = parser.parse();
        const orientation = result.tags.Orientation || null;
        console.log("Extracted EXIF orientation:", orientation);

        // Return filename and directionality (orientation)
        res.status(200).json({
          filename: req.file.filename,
          directionality: orientation
        });
      } catch (exifErr) {
        console.error("Error parsing EXIF data:", exifErr);
        // Return filename but no directionality if EXIF parsing fails
        res.status(200).json({
          filename: req.file.filename,
          directionality: null
        });
      }
    });
  });
});


app.get('/',(req,res)=>{
    res.send('test')
})
app.listen(process.env.PORT,()=>{
ConnectDb();
console.log("app listening on Port" + process.env.PORT)
});
