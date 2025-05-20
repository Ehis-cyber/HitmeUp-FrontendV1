import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, _res, next) => {
    const token = req.cookies.token; // Read the token from cookies
    if (!token) {
        return next(createError(401, "You are not authenticated!")); // Return 401 if no token is found
    }

     try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach the decoded user info to the request
        next();
    } catch (err) {
        console.error("Error verifying token:", err);
        return next(createError(403, "Invalid token" ));
      }
    };