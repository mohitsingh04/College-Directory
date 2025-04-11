import mongoose from 'mongoose';
import { db1 } from '../mongoose/index.js';

const CategorySchema = new mongoose.Schema(
    {
        userId: {
            type: Number,
        },
        uniqueId: {
            type: Number,
        },
        category_name: {
            type: String,
            required: [true, "Provide a valid category name."],
        },
        parent_category: {
            type: String,
            required: [true, "Provide a valid parent category."],
        },
        logo: {
            type: String,
            required: [true, "Provide a valid logo."],
        },
        featured_image: {
            type: String,
            required: [true, "Provide a valid featured image."],
        },
        description: {
            type: String,
            required: [true, "Provide a valid description."],
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: "Pending"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Category = db1.model('Category', CategorySchema);

export default Category;