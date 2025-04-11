import { getDataFromToken } from "../helper/getDataFromToken.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import fs from "fs";

const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

export const getCategory = async (req, res) => {
    try {
        const category = await Category.find();
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { Id } = req.params;
        const category = await Category.findOne({ _id: Id });
        if (!category) {
            return res.status(404).json({ error: "Category not found!" });
        }

        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { category_name, parent_category, description } = req.body;

        // const logo = req.files['logo'] ? req.files['logo'][0].path : "image.png";
        // const featured_image = req.files['featured_image'] ? req.files['featured_image'][0].path : "image.png";

        const category = await Category.findOne({ category_name, parent_category });
        if (category) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const lastCategory = await Category.findOne().sort({ _id: -1 }).limit(1);
        const x = lastCategory ? lastCategory.uniqueId + 1 : 1;

        const categoryPath = `./media/category/${x}/`;
        ensureDirectoryExistence(categoryPath + "logo/");
        ensureDirectoryExistence(categoryPath + "featured/");

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        let categoryLogoImagePath = "image.png";
        let categoryFeaturedImagePath = "image.png";

        if (req.files && req.files.logo) {
            const logoFile = req.files.logo[0];
            const newLogoPath = `${categoryPath}logo/${logoFile.filename}`;
            fs.renameSync(logoFile.path, newLogoPath);
            categoryLogoImagePath = newLogoPath;
        }

        if (req.files && req.files.featured_image) {
            const featuredFile = req.files.featured_image[0];
            const newFeaturedPath = `${categoryPath}featured/${featuredFile.filename}`;
            fs.renameSync(featuredFile.path, newFeaturedPath);
            categoryFeaturedImagePath = newFeaturedPath;
        }

        const newCategory = new Category({
            uniqueId: x,
            userId: userUniqueId,
            category_name,
            parent_category,
            description,
            logo: categoryLogoImagePath,
            featured_image: categoryFeaturedImagePath
        })

        const savedCategory = newCategory.save();
        return res.status(200).json({ message: "Category added successfully.", savedCategory });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { Id } = req.params;

        if (!Id) {
            return res.status(400).json({ error: "Category ID is required!" });
        }

        const category = await Category.findOne({ _id: Id });
        if (!category) {
            return res.status(404).json({ error: "Category not found!" });
        }

        const categoryId = category?.uniqueId;

        const categoryPath = `./media/category/${categoryId}/`;
        ensureDirectoryExistence(categoryPath + "logo/");
        ensureDirectoryExistence(categoryPath + "featured/");

        const { category_name, parent_category, description, status } = req.body;

        let updateCategoryLogoImagePath = category.logo;
        let updateCategoryFeaturedImagePath = category.featured_image;

        if (req.files && req.files.logo) {
            const logoFile = req.files.logo[0];
            const newLogoPath = `${categoryPath}logo/${logoFile.filename}`;
            fs.renameSync(logoFile.path, newLogoPath);
            updateCategoryLogoImagePath = newLogoPath;
        }

        if (req.files && req.files.featured_image) {
            const featuredFile = req.files.featured_image[0];
            const newFeaturedPath = `${categoryPath}featured/${featuredFile.filename}`;
            fs.renameSync(featuredFile.path, newFeaturedPath);
            updateCategoryFeaturedImagePath = newFeaturedPath;
        }

        const updatedCategory = await Category.findOneAndUpdate({ _id: Id }, {
            $set: {
                category_name,
                parent_category,
                description,
                logo: updateCategoryLogoImagePath,
                featured_image: updateCategoryFeaturedImagePath,
                status
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Category updated successfully", updatedCategory });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { Id } = req.params;

        const category = await Category.findOne({ _id: Id });
        if (!category) {
            return res.json({ error: "Category Not Found." });
        }

        const deletedCategory = await Category.findOneAndDelete({ _id: Id });
        return res.json({ message: "Category Deleted Sucessfully.", deletedCategory });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};