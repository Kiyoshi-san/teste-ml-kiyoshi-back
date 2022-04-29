import express from 'express';
import bodyParser from 'body-parser';
import productRoute from './routes/product.js';
import path from 'path';
import dotenv from "dotenv";
import cors from "cors";

//SET STATIC DIR
const __dirname = path.resolve();
dotenv.config({ path: __dirname + "/.env.local" });

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);

// #######################################
// ROUTES
// #######################################
app.get("/", (req, res) => {
  res.send("initial page API");
});
app.use("/api/items", productRoute);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
});