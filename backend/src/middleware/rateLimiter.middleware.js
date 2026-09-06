import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ipKeyGenerator } from "express-rate-limit";

const GLOBAL_LIMIT = 100;
const ADMIN_LIMIT = 2000;
const WINDOW_MS = 15 * 60 * 1000;

const getVerifiedAccessToken = (req) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token || !process.env.ACCESS_TOKEN_SECRET) return null;

    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        return null;
    }
};

const getAdminToken = (req) => {
    const token = getVerifiedAccessToken(req);
    return token?.role === "admin" && token?._id ? token : null;
};

// Public/customer traffic stays at 100 requests per 15 minutes per IP.
// A signed admin token receives a higher account-based limit for dashboard work.
export const globalLimiter = rateLimit({
    windowMs: WINDOW_MS,
    limit: (req) => getAdminToken(req) ? ADMIN_LIMIT : GLOBAL_LIMIT,
    keyGenerator: (req) => {
        const adminToken = getAdminToken(req);
        return adminToken ? `admin:${adminToken._id}` : ipKeyGenerator(req.ip);
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        const message = getAdminToken(req)
            ? "Too many admin requests, please try again after 15 minutes"
            : "Too many requests from this IP, please try again after 15 minutes";
        next(new ApiError(429, message));
    },
});

// Strict Auth Limiter: 5 failed attempts per 15 minutes per IP
export const authLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ApiError(429, "Too many authentication attempts, please try again later"));
    },
});