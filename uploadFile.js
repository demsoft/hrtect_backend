const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storageCategory = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/category');
  },
  filename: function(req, file, cb) {
    // Check file type based on its extension
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, Date.now() + "_" + Math.floor(Math.random() * 1000) + path.extname(file.originalname));
    } else {
      cb("Error: only .jpeg, .jpg, .png files are allowed!");
    }
  }
});

const uploadCategory = multer({
  storage: storageCategory,
  limits: {
    fileSize: 1024 * 1024 * 5 // limit filesize to 5MB
  },
});

const storageProduct = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/products');
  },
  filename: function(req, file, cb) {
    // Check file type based on its extension
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, Date.now() + "_" + file.originalname);
    } else {
      cb("Error: only .jpeg, .jpg, .png files are allowed!");
    }
  }
});

const uploadProduct = multer({
  storage: storageProduct,
  limits: {
    fileSize: 1024 * 1024 * 5 // limit filesize to 5MB
  },
});

// upload function
async function uploadPFromBase64(base64String) {
  try {
    //console.log("base64",base64String);
    const result = await cloudinary.uploader.upload('data:image/jpeg;base64,' + base64String, {
      transformation: [
        { crop: 'fit', quality: 'auto' }
      ],
      timeout: 60000 // Timeout in milliseconds
    });

    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

// Function to convert buffer to base64
function bufferToBase64(buffer) {
  return buffer ? buffer.toString('base64') : null;
}

async function uploadToCloudinary(req, res) {
  try {
    const file = req.file;

    if (!file || !file.buffer) {
      return res.status(400).json({ error: 'File not uploaded or buffer is undefined' });
    }

    let mimeType = file.mimetype;
    const validFiletypes = /jpeg|jpg|png/;
    if (mimeType === 'application/octet-stream') {
      const ext = path.extname(file.originalname).substring(1);
      mimeType = `image/${ext}`;
    }

    if (!validFiletypes.test(mimeType)) {
      return res.status(400).json({ error: 'Only .jpeg, .jpg, .png files are allowed!' });
    }

    // Convert file buffer to base64 string with correct MIME type
    const base64String = bufferToBase64(file.buffer);
    const imageData = `data:${mimeType};base64,${base64String}`;
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      transformation: [{ width: 400, height: 400, crop: 'fit', quality: 'auto' }]
    });

    res.status(200).json({ message: 'Image uploaded successfully', url: result.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
}


const storagePoster = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/posters');
  },
  filename: function(req, file, cb) {
    // Check file type based on its extension
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, Date.now() + "_" + file.originalname);
    } else {
      cb("Error: only .jpeg, .jpg, .png files are allowed!");
    }
  }
});

const uploadPosters = multer({
  storage: storagePoster,
  limits: {
    fileSize: 1024 * 1024 * 5 // limit filesize to 5MB
  },
});

module.exports = {
    uploadCategory,
    uploadProduct,
    uploadPosters,
    uploadPFromBase64
};
