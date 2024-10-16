const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const multer = require("multer");
const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
const { Readable } = require("stream");
const { ObjectId } = mongoose.Types;

const conn = mongoose.createConnection(process.env.MONGO_URI);
conn.once("open", () => {
  console.log("MongoDB connection established.");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/image", auth, upload.single("file"), (req, res) => {
  const fileBuffer = req.file.buffer;
  const filename =
    crypto.randomBytes(16).toString("hex") +
    path.extname(req.file.originalname);

  const readableFileStream = new Readable();
  readableFileStream.push(fileBuffer);
  readableFileStream.push(null);

  const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });

  const uploadStream = bucket.openUploadStream(filename);

  readableFileStream.pipe(uploadStream);

  uploadStream.on("finish", () => {
    console.log("Image uploaded successfully:", uploadStream.id);
    return res.json({ fileId: uploadStream.id });
  });

  uploadStream.on("error", (err) => {
    console.error("Image upload error:", err);
    return res.status(500).send(err);
  });
});

router.get("/image/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ message: "Invalid image ID format" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads",
    });

    const downloadStream = bucket.openDownloadStream(
      new ObjectId(req.params.id)
    );

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("error", (err) => {
      console.error("Image download error:", err);
      res.status(404).send({ message: "Cannot find image with that id" });
    });

    downloadStream.on("end", () => {
      res.end();
    });
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).send({ message: "Error retrieving image" });
  }
});

router.get("/", auth, async (req, res, next) => {
  const order = req.query.order ? req.query.order : "desc";
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const term = req.query.searchTerm;
  const userId = req.query.userId;

  let findArgs = {};
  for (let key in req.query.filters) {
    if (req.query.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.query.filters[key][0],
          $lte: req.query.filters[key][1],
        };
      } else {
        findArgs[key] = req.query.filters[key];
      }
    }
  }

  if (term) {
    findArgs["$text"] = { $search: term };
  }

  if (userId) {
    findArgs["userId"] = userId;
  }

  try {
    const products = await Product.find(findArgs)
      .populate("userId")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    const productsTotal = await Product.countDocuments(findArgs);
    const hasMore = skip + limit < productsTotal ? true : false;

    return res.status(200).json({
      products,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    console.log("Product created successfully:", product);
    return res.sendStatus(201);
  } catch (error) {
    console.error("Product creation error:", error);
    next(error);
  }
});

router.post("/newProduct", auth, async (req, res, next) => {
  const { userId, imageName, color, date, part, satisfactionId, time, memo } =
    req.body;

  const productData = {
    userId,
    imageName,
    color,
    date,
    part,
    satisfactionId,
    time,
    memo,
  };

  try {
    // 업로드 날짜 중복 체크
    const existingProduct = await Product.findOne({ userId, date });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "해당 날짜에 픽쳐가 존재합니다." });
    }

    const product = new Product(productData);
    await product.save();
    console.log("Product created successfully:", product);
    return res.status(201).json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(500).json({ message: "Error creating product", error });
  }
});

// GET /products/today 엔드포인트 추가
router.get("/today", auth, async (req, res) => {
  try {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}. ${
      today.getMonth() + 1
    }. ${today.getDate()}.`;

    const products = await Product.find({ date: formattedToday });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products for today:", error);
    res.status(500).json({ error: "Failed to fetch products for today" });
  }
});

router.post("/updateFlip", auth, async (req, res) => {
  const { userId, date, flip } = req.body;

  try {
    const product = await Product.findOneAndUpdate(
      { userId, date },
      { flip },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product" });
  }
});

router.post("/updateTransform", auth, async (req, res) => {
  const { userId, date, x, y, rotate, scale, zindex } = req.body;

  try {
    const product = await Product.findOneAndUpdate(
      { userId, date },
      { x, y, rotate, scale, zindex },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product" });
  }
});

// DELETE 라우트 수정
router.delete("/delete", auth, async (req, res) => {
  const { userId, date } = req.query;

  try {
    const product = await Product.findOneAndDelete({ userId, date });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
