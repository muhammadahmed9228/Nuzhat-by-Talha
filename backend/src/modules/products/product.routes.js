import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    checkSlugAvailability
} from "./product.controller.js";
import { verifyJWT, authorizeAdmin, optionalAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.route("/").get(optionalAuth, getAllProducts);
router.route("/check-slug").get(checkSlugAvailability);
router.route("/:id").get(getProductById);

// Admin only routes
router.use(verifyJWT, authorizeAdmin);
router.route("/").post(createProduct);
router.route("/:id")
    .patch(verifyJWT, authorizeAdmin, updateProductById)
    .delete(verifyJWT, authorizeAdmin, deleteProductById);

export default router;