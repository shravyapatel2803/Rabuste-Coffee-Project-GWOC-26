import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import artRoutes from "./routes/art.Routes.js";
import workshopRoutes from "./routes/workshop.Routes.js";
import orderRoutes from "./routes/order.Routes.js";
import aiRoutes from "./routes/ai.routes.js";
import franchiseRoutes from "./routes/franchise.Routes.js";

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  "https://rabuste-coffee-project-gwoc-26-39cy.vercel.app/", // user frontend
  "http://localhost:5174", // admin frontend
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Define allowed origins
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://rabuste-coffee-project-gwoc-26.vercel.app", // Main production domain
      "https://rabuste-coffee-project-gwoc-26-39cy.vercel.app"
    ];

    // Check if the origin is in the allowed list OR if it's a Vercel preview URL
    // This Regex checks if the URL ends with ".vercel.app" and contains your project name
    const isVercelPreview = origin.includes("rabuste-coffee-project") && origin.endsWith(".vercel.app");

    if (allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Rabuste Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api", itemRoutes);
app.use("/api", artRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", workshopRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/franchise", franchiseRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
