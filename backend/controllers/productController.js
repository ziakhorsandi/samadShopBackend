import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSzie = 2;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const product = await Product.find({ ...keyword })
    .limit(pageSzie)
    .skip(pageSzie * (page - 1));
  res.json({ product, page, pages: Math.ceil(count / pageSzie) });
});

//@desc Fetch single  products
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc Create a product
//@route POST /api/products
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, brand, category, countInStock, description } = req.body;
  console.log(`body`, req.body);
  const product = new Product({
    user: req.user._id,
    name: name,
    price: price,
    brand: brand,
    category: category,
    countInStock: countInStock,
    description: description,
    numReviews: 0,
    image: `/${req.file.path}`,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc Update a product
//@route PUT /api/products/:id
//@access Private/Admin
const UpdateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;
    if (req.file) {
      product.image = `/${req.file.path}`;
    } else {
      product.image = image;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc Create new review
//@route POST /api/products/:id/reviews
//@access Private
const cerateProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    let ifExistIndex = -1;
    ifExistIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (ifExistIndex !== -1) {
      product.reviews.splice(ifExistIndex, 1);
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      createdAt: Date.now(),
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    const r = await product.save();
    res.status(201).json(r);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc Get top rated products
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(product);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  UpdateProduct,
  cerateProductReview,
  getTopProducts,
};
