const express = require('express');
const router = express.Router();
const Poster = require('../model/poster');
const { uploadPFromBase64 } = require('../uploadFile');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const upload = multer(); // Using multer to handle form data

// Get all posters
router.get('/', asyncHandler(async (req, res) => {
    try {
        const posters = await Poster.find({});
        res.json({ success: true, message: "Posters retrieved successfully.", data: posters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a poster by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const posterID = req.params.id;
        const poster = await Poster.findById(posterID);
        if (!poster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }
        res.json({ success: true, message: "Poster retrieved successfully.", data: poster });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new poster
router.post('/',upload.fields([{ name: 'img' }, { name: 'imageBase64' }]), async (req, res) => {
    try {
        const { posterName, imageBase64 } = req.body;
        if (!posterName) {
            return res.status(400).json({ success: false, message: "Poster Name is required." });
        }
        if (!imageBase64) {
            return res.status(400).json({ success: false, message: "Image data is required." });
        }
        var imageUrl = '';
            if (imageBase64) {
                try {
                  const uploadResult = await uploadPFromBase64(imageBase64); // Call Cloudinary upload function
                  imageUrl = uploadResult.secure_url; // Set imageUrl to Cloudinary URL
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    if (error.http_code === 499) {
                        res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                    } else {
                        res.status(500).json({ error: 'Image upload failed', details: error.message });
                    }
                }
              }
        try {
            const newPoster = new Poster({
                posterName: posterName,
                imageUrl: imageUrl
            });
            console.log(newPoster);
            await newPoster.save();
            res.json({ success: true, message: "Poster created successfully.", data: null });
        } catch (error) {
            console.error("Error creating Poster:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    } catch (err) {
        console.log(`Error creating Poster: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Update a poster
router.put('/:id', upload.fields([{ name: 'img' }, { name: 'imageBase64' }]), async (req, res) => {
    try {
        const categoryID = req.params.id;
        const { posterName, imageBase64 } = req.body;
        
        if (!posterName) {
            return res.status(400).json({ success: false, message: "Poster Name is required." });
        }
        if (!imageBase64) {
            return res.status(400).json({ success: false, message: "Image data is required." });
        }
        var imageUrl = '';
            if (imageBase64) {
                try {
                  const uploadResult = await uploadPFromBase64(imageBase64); // Call Cloudinary upload function
                  imageUrl = uploadResult.secure_url; // Set imageUrl to Cloudinary URL
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    if (error.http_code === 499) {
                        res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                    } else {
                        res.status(500).json({ error: 'Image upload failed', details: error.message });
                    }
                }
              }
        try {
            const updatedPoster = await Poster.findByIdAndUpdate(categoryID, { posterName: posterName, imageUrl: imageUrl }, { new: true });
            if (!updatedPoster) {
                return res.status(404).json({ success: false, message: "Poster not found." });
            }
            res.json({ success: true, message: "Poster updated successfully.", data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } catch (err) {
        console.log(`Error updating poster: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Delete a poster
router.delete('/:id', asyncHandler(async (req, res) => {
    const posterID = req.params.id;
    try {
        const deletedPoster = await Poster.findByIdAndDelete(posterID);
        if (!deletedPoster) {
            return res.status(404).json({ success: false, message: "Poster not found." });
        }
        res.json({ success: true, message: "Poster deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
