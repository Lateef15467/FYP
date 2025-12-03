import ProductModel from "../models/productModel.js";

// function for add product

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      Sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestseller:
        typeof bestseller === "string"
          ? bestseller.toLowerCase() === "true"
          : !!bestseller,

      Sizes: JSON.parse(Sizes),
      image: imageUrl,
      date: Date.now(),
    };
    console.log(productData);

    const product = new ProductModel(productData);
    await product.save();

    res.json({ success: true, message: "product added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// function for list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// function for single product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ------------- getProductById --------------
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    return res.json({ success: true, product });
  } catch (error) {
    console.log("getProductById error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      Sizes,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (bestseller !== undefined) {
      product.bestseller =
        typeof bestseller === "string"
          ? bestseller.toLowerCase() === "true"
          : !!bestseller;
    }
    if (Sizes !== undefined) {
      try {
        product.Sizes = JSON.parse(Sizes);
      } catch (e) {
        product.Sizes = Array.isArray(Sizes) ? Sizes : product.Sizes;
      }
    }

    let images = Array.isArray(product.image) ? [...product.image] : [];

    const uploadFileToCloudinary = async (filePath) => {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "image",
      });
      return result.secure_url;
    };

    const files = req.files || {};

    for (let i = 1; i <= 4; i++) {
      const field = `image${i}`;
      if (files[field] && files[field][0]) {
        const file = files[field][0];
        const uploadedUrl = await uploadFileToCloudinary(file.path);
        // set at index i-1
        images[i - 1] = uploadedUrl;
      } else if (req.body[`removeImage${i}`] === "true") {
        images[i - 1] = undefined;
      }
    }

    images = images.filter((u) => u !== undefined && u !== null);

    product.image = images;

    // 3) save
    await product.save();

    return res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.log("updateProduct error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  getProductById,
  updateProduct,
};
