import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('./Backend/images');

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Error reading images directory:', err);
    process.exit(1);
  }

  files.forEach(file => {
    if (file.includes(' ')) {
      const oldPath = path.join(imagesDir, file);
      const newFileName = file.replace(/\s+/g, '_');
      const newPath = path.join(imagesDir, newFileName);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error('Error renaming ' + file + ' to ' + newFileName + ':', err);
        } else {
          console.log('Renamed ' + file + ' to ' + newFileName);
        }
      });
    }
  });
});
