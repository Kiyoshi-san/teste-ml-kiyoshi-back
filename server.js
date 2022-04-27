import express from 'express';
import bodyParser from 'body-parser';
import productRoute from './routes/product.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);

// #######################################
// ROUTES
// #######################################
app.get("/", (req, res) => {
  res.send("Homepage");
});
app.use("/api/items", productRoute);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
});