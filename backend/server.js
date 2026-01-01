import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import itemRoutes from "./routes/item.routes.js";
import artRoutes from "./routes/art.Routes.js";
import workshopRoutes from "./routes/workshop.Routes.js";
import orderRoutes from "./routes/order.Routes.js";

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:5173", // user frontend
  "http://localhost:5174", // admin frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Rabuste Backend Running 🚀");
});

app.use("/api", itemRoutes);
app.use("/api", artRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", workshopRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
