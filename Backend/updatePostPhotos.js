import mongoose from 'mongoose';
import Post from './models/Post.js'; // Adjust path if needed

const MONGO_URL = 'mongodb+srv://urmilasawaldekar201087:Urmilablogging@cluster0.mhipk6i.mongodb.net';

const validPhotos = [
  "1752423968226Screenshot_2025-07-13_213146.png",
  "1752424104916Screenshot_2025-07-13_213146.png",
  "1752424106004Screenshot_2025-07-13_213146.png",
  "1752424186353Screenshot_2025-07-13_213146.png",
  "1752424188001Screenshot_2025-07-13_213146.png",
  "1752424188692Screenshot_2025-07-13_213146.png",
  "1752424211714Screenshot_2025-07-13_213146.png",
  "1752424214787Screenshot_2025-07-13_213146.png",
  "1752424215772Screenshot_2025-07-13_213146.png",
  "1752424216770Screenshot_2025-07-13_213146.png",
  "1752424241824Screenshot_2025-07-13_213146.png",
  "1752424282521Screenshot_2025-07-13_213146.png",
  "1752424283871Screenshot_2025-07-13_213146.png",
  "1752424434666Screenshot_2025-07-13_213146.png",
  "1752424435838Screenshot_2025-07-13_213146.png",
  "1752424436001Screenshot_2025-07-13_213146.png",
  "1752424436175Screenshot_2025-07-13_213146.png",
  "1752424436361Screenshot_2025-07-13_213146.png",
  "1752424521601Screenshot_2025-07-13_213146.png",
  "1752424522665Screenshot_2025-07-13_213146.png",
  "1752424522835Screenshot_2025-07-13_213146.png",
  "1752424523003Screenshot_2025-07-13_213146.png",
  "1752424523220Screenshot_2025-07-13_213146.png",
  "1752424600543Screenshot_2025-07-13_213146.png",
  "1752424601285Screenshot_2025-07-13_213146.png",
  "1752426245613Screenshot_2025-07-13_213146.png",
  "1752475190105Screenshot_2025-07-13_213146.png",
  "1752475867093Screenshot_2025-07-13_213146.png",
  "1752477845770Screenshot_2025-07-14_125349.png",
  "1752478308406Screenshot_2025-07-14_130007.png",
  "1752488173555Screenshot_2025-07-14_125349.png",
  "1752508130960Screenshot_2025-07-14_125349.png",
  "Screenshot_2025-01-07_151616.png",
  "Screenshot_2025-07-14_125349.png",
  "Screenshot_2025-07-14_130007.png"
];

async function connectDb() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
}

async function updatePostPhotos() {
  try {
    const posts = await Post.find({}, 'photo').lean();
    let updatedCount = 0;

    for (const post of posts) {
      if (post.photo && !validPhotos.includes(post.photo)) {
        console.log('Post ' + post._id + ' photo "' + post.photo + '" is invalid. Updating to empty.');
        await Post.findByIdAndUpdate(post._id, { $unset: { photo: "" } });
        updatedCount++;
      }
    }

    console.log('Completed. Updated ' + updatedCount + ' posts.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating post photos:', err);
    process.exit(1);
  }
}

async function main() {
  await connectDb();
  await updatePostPhotos();
}

main();
