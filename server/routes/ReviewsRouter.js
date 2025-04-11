import express from "express";
import { addReviews, deleteReviews, getReviews, getReviewsById, updateReviews } from "../controller/ReviewsController.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/reviews", getReviews);
reviewsRouter.get("/reviews/:uniqueId", getReviewsById);
reviewsRouter.post("/reviews", addReviews);
reviewsRouter.put("/reviews/:uniqueId", updateReviews);
reviewsRouter.delete("/reviews/:uniqueId", deleteReviews);

export default reviewsRouter;