const express = require('express');
const router = express.Router();
const Category = require('../model/category');
const SubCategory = require('../model/subCategory');
const Product = require('../model/product');
const { uploadPFromBase64 } = require('../uploadFile');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const upload = multer(); // Using multer to handle form data

// Get all categories
router.get('/', asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ success: true, message: "Categories retrieved successfully.", data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a category by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryID = req.params.id;
        const category = await Category.findById(categoryID);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }
        res.json({ success: true, message: "Category retrieved successfully.", data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new category with image upload
router.post('/', upload.fields([{ name: 'img' }, { name: 'imageBase64' }]), async (req, res) => {
    try {
        const { name, imageBase64 } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required." });
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
                const newCategory = new Category({
                    name: name,
                    image: imageUrl
                });
                await newCategory.save();
                res.json({ success: true, message: "Category created successfully.", data: null });
            } catch (error) {
                console.error("Error creating category:", error);
                res.status(500).json({ success: false, message: error.message });
            }

    } catch (err) {
        console.log(`Error creating category: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Update a category
router.put('/:id', upload.fields([{ name: 'img' }, { name: 'imageBase64' }]), async (req, res) => {
    try {
        const categoryID = req.params.id;

        const { name, imageBase64 } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required." });
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
            const updatedCategory = await Category.findByIdAndUpdate(categoryID, { name: name, image: imageUrl }, { new: true });
            if (!updatedCategory) {
                return res.status(404).json({ success: false, message: "Category not found." });
            }
            res.json({ success: true, message: "Category updated successfully.", data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }

    } catch (err) {
        console.log(`Error updating category: ${err.message}`);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Delete a category
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const categoryID = req.params.id;

        // Check if any subcategories reference this category
        const subcategories = await SubCategory.find({ categoryId: categoryID });
        if (subcategories.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete category. Subcategories are referencing it." });
        }

        // Check if any products reference this category
        const products = await Product.find({ proCategoryId: categoryID });
        if (products.length > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete category. Products are referencing it." });
        }

        // If no subcategories or products are referencing the category, proceed with deletion
        const category = await Category.findByIdAndDelete(categoryID);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }
        res.json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));






module.exports = router;
