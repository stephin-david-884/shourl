import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import authRoutes from "./interfaces/routes/authRoutes";
import urlRoutes from "./interfaces/routes/urlRoutes";
import { errorHandler } from "./interfaces/middlewares/errorHandler";
import { connectDB } from "./infrastructure/config/mongo.config";
import { urlController } from "./infrastructure/di/container";

dotenv.config();

const app = express();

connectDB();

const allowedOrigins = process.env.FRONTEND_URL?.split(',').map(
    origin => origin.trim()
) || [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

app.get(
  "/:shortCode",
  urlController.redirectUrl,
);

app.use(errorHandler);

const httpServer = createServer(app);

const PORT = Number(process.env.PORT) || 5000;

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log('Server started...')
});