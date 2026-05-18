const express = require("express");

const app = express();

const router = express.Router();

const PORT = 3000;

app.use(express.json());



const products = [
  {
    id: 1,
    name: "Laptop",
    category: "elektronik",
    price: 15000000
  },
  {
    id: 2,
    name: "Charger",
    category: "elektronik",
    price: 2000000
  },
    {
    id: 3,
    name: "earphone",
    category: "elekronik",
    price: 500000
  },
  {
    id: 4,
    name: "casing",
    category: "aksesoris",
    price: 30000
  }
];

const orders = [
  {
    id: 1,
    userId: 1
  }
];

const reviews = [
  {
    id: 1,
    productId: 1,
    rating: 5,
    comment: "Excellent"
  }
];


router.get("/products", (req, res) => {
  const { category, sort, limit } =
    req.query;

  let result = [...products];

  // FILTER CATEGORY
  if (category) {
    const value =
      category.toLowerCase();

    result = result.filter(
      (product) =>
        product.category.toLowerCase() ===
        value
    );
  }

  // SORT PRICE ASC
  if (sort === "price_asc") {
    result.sort(
      (a, b) => a.price - b.price
    );
  }

  // SORT PRICE DESC
  if (sort === "price_desc") {
    result.sort(
      (a, b) => b.price - a.price
    );
  }

  // LIMIT DATA
  if (limit) {
    result = result.slice(
      0,
      Number(limit)
    );
  }

  res.status(200).json(result);
});


router.post("/orders", (req, res) => {
  const { userId, products: productIds } =
    req.body;

  const selectedProducts = products.filter(
    (product) =>
      productIds.includes(product.id)
  );

  const total = selectedProducts.reduce(
    (sum, product) =>
      sum + product.price,
    0
  );

  const newOrder = {
    id: orders.length + 1,
    userId,
    products: selectedProducts,
    total
  };

  orders.push(newOrder);

  res.status(201).json({
    success: true,
    message: "Order created",
    data: newOrder
  });
});

router.delete("/orders/:id", (req, res) => {
  res.status(200).json({
    success: true,
    message: `Order ${req.params.id} deleted`
  });
});


router.get(
  "/users/:userId/orders",
  (req, res) => {
    const userId = Number(
      req.params.userId
    );

    const userOrders = orders.filter(
      (order) => order.userId === userId
    );

    res.status(200).json(userOrders);
  }
);

router.get(
  "/products/:productId/reviews",
  (req, res) => {
    const productId = Number(
      req.params.productId
    );

    const productReviews = reviews.filter(
      (review) =>
        review.productId === productId
    );

    res.status(200).json(productReviews);
  }
);

app.use("/api/v1", router);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});