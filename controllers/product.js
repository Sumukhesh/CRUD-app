const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

//parameter kicking in
exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err) {
      return res.json("Cannot find the Product in Database");
    } else {
      req.product = product;
      next();
    }
  });
};

//creating a product
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  //This will keep the file extensions(.jpeg, .png) as same when uploaded in dir

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with the file " });
    }

    const { name, description, imageURL, price } = fields;

    if (!name || !description || !imageURL || !price) {
      return res.status(400).json({
        error: "Please enter all the fields",
      });
    }

    let product = new Product(fields);

    //handling the file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Saving the product to database
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving product into db failed",
        });
      }
      res.json(product);
    });
  });
};

//updating the product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  //This will keep the file extensions(.jpeg, .png) as same when uploaded in dir

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with the file " });
    }

    let product = req.product;
    product = _.extend(product, fields);

    //handling the file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Saving the product to database
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving product into db failed",
        });
      }
      res.json(product);
    });
  });
};

//deleting the product

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedprod) => {
    if (err) {
      return res.status(400).json({
        error: `Unable to remove the ${product.name}`,
      });
    }
    res.json({
      message: "Deleteion successful",
      deletedprod,
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware to help the photo load faster
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No products found",
        });
      }
      res.json(products);
    });
};
