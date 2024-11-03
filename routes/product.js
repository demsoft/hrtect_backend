const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const { uploadPFromBase64 } = require('../uploadFile');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const upload = multer(); // Using multer to handle form data

// Get all products
router.get('/', asyncHandler(async (req, res) => {
    try {
        const products = await Product.find()
        .populate('proCategoryId', 'id name')
        .populate('proSubCategoryId', 'id name')
        .populate('proBrandId', 'id name')
        .populate('proVariantTypeId', 'id type')
        .populate('proVariantId', 'id name');
        res.json({ success: true, message: "Products retrieved successfully.", data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a product by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const productID = req.params.id;
        const product = await Product.findById(productID)
            .populate('proCategoryId', 'id name')
            .populate('proSubCategoryId', 'id name')
            .populate('proBrandId', 'id name')
            .populate('proVariantTypeId', 'id name')
            .populate('proVariantId', 'id name');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product retrieved successfully.", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

router.post('/', upload.none(), async (req, res) => {
    try {
        const { name, description, quantity, price, offerPrice, proCategoryId, proSubCategoryId, proBrandId, proVariantTypeId, proVariantId, imageBase641, imageBase642, imageBase643, imageBase644, imageBase645 } = req.body;

            // Check if any required fields are missing
            if (!name || !quantity || !price || !proCategoryId || !proSubCategoryId) {
                return res.status(400).json({ success: false, message: "Required fields are missing." });
            }
            // console.log(req.body);
            // console.log(req.body.imagesBase641);
            
            if (!imageBase641) {
                return res.status(400).json({ success: false, message: "At least one image is required." });
            }
            let imageUrls = [];

            if (imageBase641) {
                try {
                  const uploadResult = await uploadPFromBase64(imageBase641); // Call Cloudinary upload function
                  imageUrls.push({ image: 1, url: uploadResult.secure_url });
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    if (error.http_code === 499) {
                        res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                    } else {
                        res.status(500).json({ error: 'Image upload failed', details: error.message });
                    }
                }
              }  
              if (imageBase642) {
                try {
                  const uploadResult = await uploadPFromBase64(imageBase642); // Call Cloudinary upload function
                  imageUrls.push({ image: 2, url: uploadResult.secure_url });
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    if (error.http_code === 499) {
                        res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                    } else {
                        res.status(500).json({ error: 'Image upload failed', details: error.message });
                    }
                }
              }    
              if (imageBase643) {
                try {
                  const uploadResult = await uploadPFromBase64(imageBase643); // Call Cloudinary upload function
                  imageUrls.push({ image: 3, url: uploadResult.secure_url });
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    if (error.http_code === 499) {
                        res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                    } else {
                        res.status(500).json({ error: 'Image upload failed', details: error.message });
                    }
                }
              }    
              if (imageBase644) {
                try {
                  const uploadResult = await uploadPFromBase64(imageBase644); // Call Cloudinary upload function
                  imageUrls.push({ image: 4, url: uploadResult.secure_url });
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    if (error.http_code === 499) {
                        res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                    } else {
                        res.status(500).json({ error: 'Image upload failed', details: error.message });
                    }
                }
              }   
              if (imageBase645) {
                try {
                  const uploadResult = await uploadPFromBase64(imageBase645); // Call Cloudinary upload function
                  imageUrls.push({ image: 5, url: uploadResult.secure_url });
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    if (error.http_code === 499) {
                        res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                    } else {
                        res.status(500).json({ error: 'Image upload failed', details: error.message });
                    }
                }
              }  
                    // Create a new product object with data
                    const newProduct = new Product({ name, description, quantity, price, offerPrice, proCategoryId, proSubCategoryId, proBrandId,proVariantTypeId, proVariantId, images: imageUrls });
                    console.log(newProduct);
                    // Save the new product to the database
                    await newProduct.save();
        
                    // Send a success response back to the client
                    res.json({ success: true, message: "Product created successfully.", data: null });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});



// Update a product
router.put('/:id', upload.none(), async (req, res) => {
    const productId = req.params.id;
    try {
        // // Execute the Multer middleware to handle file fields
        // uploadProduct.fields([
        //     { name: 'image1', maxCount: 1 },
        //     { name: 'image2', maxCount: 1 },
        //     { name: 'image3', maxCount: 1 },
        //     { name: 'image4', maxCount: 1 },
        //     { name: 'image5', maxCount: 1 }
        // ])(req, res, async function (err) {
        //     if (err) {
        //         console.log(`Update product: ${err}`);
        //         return res.status(500).json({ success: false, message: err.message });
        //     }
        // });
        const { name, description, quantity, price, offerPrice, proCategoryId, proSubCategoryId, proBrandId, proVariantTypeId, proVariantId, imageBase641, imageBase642, imageBase643, imageBase644, imageBase645 } = req.body;

        // Find the product by ID
        const productToUpdate = await Product.findById(productId);
        if (!productToUpdate) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        // Update product properties if provided
        productToUpdate.name = name || productToUpdate.name;
        productToUpdate.description = description || productToUpdate.description;
        productToUpdate.quantity = quantity || productToUpdate.quantity;
        productToUpdate.price = price || productToUpdate.price;
        productToUpdate.offerPrice = offerPrice || productToUpdate.offerPrice;
        productToUpdate.proCategoryId = proCategoryId || productToUpdate.proCategoryId;
        productToUpdate.proSubCategoryId = proSubCategoryId || productToUpdate.proSubCategoryId;
        productToUpdate.proBrandId = proBrandId || productToUpdate.proBrandId;
        productToUpdate.proVariantTypeId = proVariantTypeId || productToUpdate.proVariantTypeId;
        productToUpdate.proVariantId = proVariantId || productToUpdate.proVariantId;

        // if (!imageBase641) {
        //     return res.status(400).json({ success: false, message: "At least one image is required." });
        // }

        if (imageBase641) {
            try {
              const uploadResult = await uploadPFromBase64(imageBase641); // Call Cloudinary upload function
              let imageEntry = productToUpdate.images.find(img => img.image === 1);
              if (imageEntry) {
                  imageEntry.url = uploadResult.secure_url;
              } else {
                  productToUpdate.images.push({ image: 1, url: uploadResult.secure_url });
              }
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                if (error.http_code === 499) {
                    res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                } else {
                    res.status(500).json({ error: 'Image upload failed', details: error.message });
                }
            }
          }  
          if (imageBase642) {
            try {
              const uploadResult = await uploadPFromBase64(imageBase642); // Call Cloudinary upload function
              let imageEntry = productToUpdate.images.find(img => img.image === 2);
              if (imageEntry) {
                  imageEntry.url = uploadResult.secure_url;
              } else {
                  productToUpdate.images.push({ image: 2, url: uploadResult.secure_url });
              }
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                if (error.http_code === 499) {
                    res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                } else {
                    res.status(500).json({ error: 'Image upload failed', details: error.message });
                }
            }
          }    
          if (imageBase643) {
            try {
              const uploadResult = await uploadPFromBase64(imageBase643); // Call Cloudinary upload function
              let imageEntry = productToUpdate.images.find(img => img.image === 3);
              if (imageEntry) {
                  imageEntry.url = uploadResult.secure_url;
              } else {
                  productToUpdate.images.push({ image: 3, url: uploadResult.secure_url });
              }
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                if (error.http_code === 499) {
                    res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                } else {
                    res.status(500).json({ error: 'Image upload failed', details: error.message });
                }
            }
          }    
          if (imageBase644) {
            try {
              const uploadResult = await uploadPFromBase64(imageBase644); // Call Cloudinary upload function
              let imageEntry = productToUpdate.images.find(img => img.image === 4);
              if (imageEntry) {
                  imageEntry.url = uploadResult.secure_url;
              } else {
                  productToUpdate.images.push({ image: 4, url: uploadResult.secure_url });
              }
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                if (error.http_code === 499) {
                    res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                } else {
                    res.status(500).json({ error: 'Image upload failed', details: error.message });
                }
            }
          }   
          if (imageBase645) {
            try {
              const uploadResult = await uploadPFromBase64(imageBase645); // Call Cloudinary upload function
              let imageEntry = productToUpdate.images.find(img => img.image === 5);
              if (imageEntry) {
                  imageEntry.url = uploadResult.secure_url;
              } else {
                  productToUpdate.images.push({ image: 5, url: uploadResult.secure_url });
              }
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                if (error.http_code === 499) {
                    res.status(500).json({ error: 'Image upload timed out. Please try again.' });
                } else {
                    res.status(500).json({ error: 'Image upload failed', details: error.message });
                }
            }
          }  
        // // Iterate over the file fields to update images
        // const fields = ['image1', 'image2', 'image3', 'image4', 'image5'];
        // fields.forEach((field, index) => {
        //     if (req.files[field] && req.files[field].length > 0) {
        //         const file = req.files[field][0];
        //         const imageUrl = `http://localhost:3000/image/products/${file.filename}`;
        //         // Update the specific image URL in the images array
        //         let imageEntry = productToUpdate.images.find(img => img.image === (index + 1));
        //         if (imageEntry) {
        //             imageEntry.url = imageUrl;
        //         } else {
        //             // If the image entry does not exist, add it
        //             productToUpdate.images.push({ image: index + 1, url: imageUrl });
        //         }
        //     }
        // });

        // Save the updated product
        await productToUpdate.save();
        res.json({ success: true, message: "Product updated successfully." });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a product
router.delete('/:id', asyncHandler(async (req, res) => {
    const productID = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(productID);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
