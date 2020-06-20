const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  photo,
} = require("../controllers/product");

router.param("productId", getProductById);

//CRUD Routes

//Create route
router.post("/product/create", createProduct);

//Update Route
router.put("/product/:productId", updateProduct);

//Delete route
router.delete("/product/:productId", deleteProduct);

//read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//Listings or all the products
router.get("/products", getAllProducts);

module.exports = router;
