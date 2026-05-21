import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../modules/auth/auth.interface";
import sendResponse from "../utils/sendResponse";
import verifyToken from "../utils/verifyToken";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          success: false,
          message: "User unauthorized!",
          statusCode: 401,
        });
        return;
      }

      const decoded = verifyToken(token, config.secret as string);

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE id=$1   
      `,
        [decoded.id],
      );

      if (userData.rows.length === 0) {
        sendResponse(res, {
          success: false,
          statusCode: 404,
          message: "User not found!",
        });
      }

      const user = userData.rows[0];

      if (!user.length && !roles.includes(user.role)) {
        sendResponse(res, {
          success: false,
          statusCode: 403,
          message: "Forbidden!",
        });
      }

      req.user = decoded;

      next();
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: error.message,
        errors: error,
        statusCode: 500,
      });
    }
  };
};

export default auth;
