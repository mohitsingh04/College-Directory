import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

export const getProperty = async (req, res) => {
    try {
        const property = await Property.find();
        return res.status(200).json(property);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// export const getProperty = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = 10;
//         const skip = (page - 1) * limit;
//         const properties = await Property.find()
//             .skip(skip)
//             .limit(limit)
//             .exec();
//         const total = await Property.countDocuments();
//         return res.status(200).json({
//             total,
//             page,
//             totalPages: Math.ceil(total / limit),
//             properties,
//         });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

export const getPropertyById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const property = await Property.findOne({ uniqueId });
        return res.status(200).json(property);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const addProperty = async (req, res) => {
    try {
        const { property_type, property_name, short_name, phone_number, email, affiliated_by, established_year, college_or_university_type } = req.body;

        const existPhone = await Property.findOne({ phone_number });
        if (existPhone) {
            return res.status(404).json({ error: "Property already exist with this phone number." });
        }

        const existEmail = await Property.findOne({ email });
        if (existEmail) {
            return res.status(404).json({ error: "Property already exist with this email." });
        }

        const lastProperty = await Property.findOne().sort({ _id: -1 }).limit(1);
        const x = lastProperty ? lastProperty.uniqueId + 1 : 180400;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        const uniqueId = user?.uniqueId;
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user?.role === "Property Manager") {
            const existingProperty = await Property.findOne({ userId: uniqueId });
            if (existingProperty) {
                return res.status(400).json({ error: "Property Manager already has a property" });
            }
        }

        const userUniqueId = user.uniqueId;

        const newProperty = new Property({
            uniqueId: x,
            userId: userUniqueId,
            property_type,
            property_name,
            short_name,
            phone_number,
            email,
            affiliated_by,
            college_or_university_type,
            established_year
        })

        const savedProperty = await newProperty.save();
        return res.status(200).json({ message: "Property added successfully", savedProperty });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateProperty = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Property ID is required!" });
        }

        const property = await Property.findOne({ uniqueId });
        if (!property) {
            return res.status(404).json({ error: "Property not found!" });
        }

        const { property_type, property_name, short_name, phone_number, alt_phone_number, email, affiliated_by, established_year, college_or_university_type, status } = req.body;

        if (phone_number === alt_phone_number) {
            return res.status(404).json({ error: "Phone number and Alt phone number cannot be same." });
        }

        const updatedProperty = await Property.findOneAndUpdate({ uniqueId }, {
            $set: {
                property_type,
                property_name,
                short_name,
                phone_number,
                alt_phone_number,
                email,
                affiliated_by,
                established_year,
                college_or_university_type,
                status
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedProperty });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// export const handleUpdateFiles = async (req, res) => {
//     try {
//         const { uniqueId } = req.params;

//         if (!uniqueId) {
//             return res.status(400).json({ error: "Property ID is required!" });
//         }

//         const property = await Property.findOne({ uniqueId });
//         if (!property) {
//             return res.status(404).json({ error: "Property not found." });
//         }

//         const propertyId = property?.uniqueId;
//         const propertyPath = `./media/property/${propertyId}/`;
//         ensureDirectoryExistence(propertyPath + "logo/");
//         ensureDirectoryExistence(propertyPath + "featured/");

//         let updatePropertyLogoImagePath = property.logo;
//         let updatePropertyFeaturedImagePath = property.featured_image;

//         // ✅ Resize & move logo image
//         if (req.files && req.files.logo) {
//             const logoFile = req.files.logo[0];
//             const newLogoPath = `${propertyPath}logo/${logoFile.filename}`;

//             // Resize with Sharp
//             await sharp(logoFile.path)
//                 .resize(100, 100) // Resize to 100x100 (adjust as needed)
//                 .toFile(newLogoPath);

//             // fs.unlinkSync(logoFile.path); // Delete temp file after resizing
//             updatePropertyLogoImagePath = newLogoPath;
//         }

//         // ✅ Resize & move featured image
//         if (req.files && req.files.featured_image) {
//             const featuredFile = req.files.featured_image[0];
//             const newFeaturedPath = `${propertyPath}featured/${featuredFile.filename}`;

//             // Resize with Sharp
//             await sharp(featuredFile.path)
//                 .resize(800, 400) // Resize to 800x400 (adjust as needed)
//                 .toFile(newFeaturedPath);

//             // fs.unlinkSync(featuredFile.path); // Delete temp file after resizing
//             updatePropertyFeaturedImagePath = newFeaturedPath;
//         }

//         const updatedProperty = await Property.findOneAndUpdate(
//             { uniqueId },
//             {
//                 $set: {
//                     logo: updatePropertyLogoImagePath,
//                     featured_image: updatePropertyFeaturedImagePath,
//                 }
//             },
//             { new: true }
//         );

//         return res.status(200).json({ message: "Updated successfully.", updatedProperty });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

const deleteFileIfExists = async (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        try {
            await fs.promises.unlink(filePath);
            console.log(`Deleted old file: ${filePath}`);
        } catch (err) {
            console.warn(`Failed to delete file ${filePath}: ${err.message}`);
        }
    }
};

export const handleUpdateFiles = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Property ID is required!" });
        }

        const property = await Property.findOne({ uniqueId });
        if (!property) {
            return res.status(404).json({ error: "Property not found." });
        }

        const propertyPath = `./media/property/${uniqueId}/`;
        const logoPath = `${propertyPath}logo/`;
        const featuredPath = `${propertyPath}featured/`;

        ensureDirectoryExistence(logoPath);
        ensureDirectoryExistence(featuredPath);

        let updatePropertyLogo = property.logo;
        let updatePropertyLogoCompressed = property.logo_compressed;
        let updatePropertyFeatured = property.featured_image;
        let updatePropertyFeaturedCompressed = property.featured_image_compressed;

        // Helper: process and save original + webp
        const processFile = async (file, targetDir, size = null) => {
            const ext = path.extname(file.originalname).toLowerCase();
            const baseName = path.basename(file.filename, ext);

            const originalTarget = `${targetDir}${baseName}${ext}`;
            const webpTarget = `${targetDir}${baseName}-compressed.webp`;

            // Move original file
            await fs.promises.rename(file.path, originalTarget);

            // Create compressed WebP
            let sharpInstance = sharp(originalTarget);
            if (size) {
                sharpInstance = sharpInstance.resize(size.width, size.height);
            }
            await sharpInstance.toFormat('webp').toFile(webpTarget);

            return {
                original: originalTarget,
                compressed: webpTarget
            };
        };

        // ✅ Process logo
        if (req.files && req.files.logo) {
            // Delete old files before processing
            await deleteFileIfExists(property.logo);
            await deleteFileIfExists(property.logo_compressed);

            const logoFile = req.files.logo[0];
            const result = await processFile(logoFile, logoPath, { width: 100, height: 100 });

            updatePropertyLogo = result.original;
            updatePropertyLogoCompressed = result.compressed;
        }

        // ✅ Process featured image
        if (req.files && req.files.featured_image) {
            // Delete old files before processing
            await deleteFileIfExists(property.featured_image);
            await deleteFileIfExists(property.featured_image_compressed);

            const featuredFile = req.files.featured_image[0];
            const result = await processFile(featuredFile, featuredPath, { width: 800, height: 400 });

            updatePropertyFeatured = result.original;
            updatePropertyFeaturedCompressed = result.compressed;
        }

        const updatedProperty = await Property.findOneAndUpdate(
            { uniqueId },
            {
                $set: {
                    logo: updatePropertyLogo,
                    logo_compressed: updatePropertyLogoCompressed,
                    featured_image: updatePropertyFeatured,
                    featured_image_compressed: updatePropertyFeaturedCompressed,
                }
            },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedProperty });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const property = await Property.findOne({ uniqueId });
        if (!property) {
            return res.json({ error: "Property Not Found." });
        }

        const deletedProperty = await Property.findOneAndDelete({ uniqueId });
        return res.json({ message: "Deleted Sucessfully.", deletedProperty });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};