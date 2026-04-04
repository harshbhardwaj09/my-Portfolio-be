import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const UNAUTHORIZED_MESSAGE = "Unauthorized: invalid or missing bearer token";
const TOKEN_SECRET_MESSAGE = "Server configuration error: BLOG_TOKEN_SECRET is not set";

export const requireBlogWriteToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokenSecret = process.env.BLOG_TOKEN_SECRET;

  if (!tokenSecret) {
    return res.status(500).json({
      message: TOKEN_SECRET_MESSAGE,
    });
  }

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
  }

  const [scheme, token] = authorizationHeader.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
  }

  try {
    const decoded = jwt.verify(token, tokenSecret) as JwtPayload;

    if (decoded.scope !== "blog:write") {
      return res.status(403).json({ message: "Forbidden: insufficient scope" });
    }
  } catch {
    return res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
  }

  return next();
};
