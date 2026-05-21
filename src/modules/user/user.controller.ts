import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    sendResponse(res, {
      success: true,
      message: "successful",
      statusCode: 200,
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

export const userController = {
  createUser,
};
