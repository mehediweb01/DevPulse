import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      message: error.message,
      error: error,
      statusCode: 500,
    });
  }
};

export const authController = {
  createUser,
};
