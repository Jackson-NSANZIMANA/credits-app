import express, { json } from "express";
import cors from "cors";
const app = express();
import authRoutes from "./routes/auth.routes.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
app.use(cors());
app.use(json());
//public routes
app.use("/api/v1/auth", authRoutes);
//resources-routes (private)
//not found error
app.use(notFound);
//error handling middleware
app.use(errorHandlerMiddleware);
export default app;
