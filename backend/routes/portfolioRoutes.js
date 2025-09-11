import express from "express";
import Portfolio from "../models/PortfolioSchema.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    res.json(portfolio?.products || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    const product = portfolio.products.id(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/services", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    res.json(portfolio?.services || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    const service = portfolio.services.id(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    res.json(portfolio?.projects || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    const project = portfolio.projects.id(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/reviews", async (req, res) => {
  try {
    const { category } = req.query;
    const portfolio = await Portfolio.findOne();

    let reviews = portfolio?.reviews || [];

    if (category) {
      reviews = reviews.filter((review) => review.category === category);
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    let { gallery, ...rest } = req.body;

    if (gallery && typeof gallery === "string") {
      gallery = gallery.split(",").map((url) => url.trim()).slice(0, 5);
    }

    let portfolio = await Portfolio.findOne();
    if (!portfolio) portfolio = new Portfolio();

    portfolio.products.push({ ...rest, gallery });
    await portfolio.save();

    res.json({ success: true, products: portfolio.products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/services", async (req, res) => {
  try {
    let { gallery, ...rest } = req.body;

    if (gallery && typeof gallery === "string") {
      gallery = gallery.split(",").map((url) => url.trim()).slice(0, 5);
    }

    let portfolio = await Portfolio.findOne();
    if (!portfolio) portfolio = new Portfolio();

    portfolio.services.push({ ...rest, gallery });
    await portfolio.save();

    res.json({ success: true, services: portfolio.services });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/projects", async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) portfolio = new Portfolio();

    portfolio.projects.push(req.body);
    await portfolio.save();

    res.json({ success: true, projects: portfolio.projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) portfolio = new Portfolio();

    portfolio.reviews.push(req.body);
    await portfolio.save();

    res.json({ success: true, reviews: portfolio.reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:section/:index", async (req, res) => {
  try {
    const { section, index } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    if (!["products", "services", "projects", "reviews"].includes(section)) {
      return res.status(400).json({ message: "Invalid section" });
    }

    if (!portfolio[section][index]) {
      return res.status(404).json({ message: "Item not found" });
    }

    let updatedItem = req.body;

    if ((section === "products" || section === "services") && updatedItem.gallery) {
      if (typeof updatedItem.gallery === "string") {
        updatedItem.gallery = updatedItem.gallery.split(",").map((url) => url.trim()).slice(0, 5);
      }
    }

    portfolio[section][index] = { ...portfolio[section][index]._doc, ...updatedItem };
    await portfolio.save();

    res.json({ success: true, [section]: portfolio[section] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    res.json({
      products: portfolio?.products.length || 0,
      services: portfolio?.services.length || 0,
      projects: portfolio?.projects.length || 0,
      reviews: portfolio?.reviews.length || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to count portfolio items" });
  }
});


router.delete("/:section/:index", async (req, res) => {
  try {
    const { section, index } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    if (!["products", "services", "projects", "reviews"].includes(section)) {
      return res.status(400).json({ message: "Invalid section" });
    }

    if (!portfolio[section][index]) {
      return res.status(404).json({ message: "Item not found" });
    }

    portfolio[section].splice(index, 1);
    await portfolio.save();

    res.json({ success: true, [section]: portfolio[section] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
