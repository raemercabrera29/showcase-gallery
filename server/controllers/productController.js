import mongoose from "mongoose";
import Product from "../models/Product.js";

const MAX_IMAGE_BYTES = 1024 * 1024;

function validateProduct(body) {
    const {
        name,
        price,
        description,
        image
    } = body ?? {};

    if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
        throw new Error("Name is required (maximum 80 characters).");
    }

    const numericPrice = Number(price);
    if (
        price === undefined ||
        price === null ||
        price === "" ||
        !Number.isFinite(numericPrice) ||
        numericPrice <= 0
    ) {
        throw new Error("Price must be a number greater than zero.");
    }

    if (
        typeof description !== "string" ||
        !description.trim() ||
        description.trim().length > 300
    ) {
        throw new Error("Description is required (maximum 300 characters).");
    }

    if (typeof image !== "string") {
        throw new Error("Image is required. Upload a JPG, PNG, or WEBP image.");
    }

    // Activity 1's FileReader supplies an image as a base64 data URL.
    const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(image);
    if (!match || match[2].length % 4 !== 0) {
        throw new Error("Image must be a JPG, PNG, or WEBP upload.");
    }

    const size = Buffer.from(match[2], "base64").length;
    if (size === 0 || size > MAX_IMAGE_BYTES) {
        throw new Error("Image must be 1 MB or smaller.");
    }

    return {
        name: name.trim(),
        price: numericPrice,
        description: description.trim(),
        image,
    };
}

function sendError(res, error) {
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            message: error.message
        });
    }
    console.error("Product API error:", error);
    return res.status(500).json({
        message: "Server error. Please try again."
    });
}

// GET ALL PRODUCTS
export async function getProducts(req, res) {
    try {
        const products = await Product.find().sort({
            createdAt: -1
        });
        return res.status(200).json(products);
    } catch (error) {
        return sendError(res, error);
    }
}

// CREATE PRODUCT
export async function createProduct(req, res) {
    let data;
    try {
        data = validateProduct(req.body);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }

    try {
        const product = await Product.create(data);
        return res.status(201).json(product);
    } catch (error) {
        return sendError(res, error);
    }
}

// UPDATE PRODUCT
export async function updateProduct(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Invalid product ID."
        });
    }

    let data;
    try {
        data = validateProduct(req.body);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }

    try {
        const product = await Product.findByIdAndUpdate(req.params.id, data, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        return sendError(res, error);
    }
}

// DELETE PRODUCT
export async function deleteProduct(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Invalid product ID."
        });
    }

    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully."
        });
    } catch (error) {
        return sendError(res, error);
    }
}