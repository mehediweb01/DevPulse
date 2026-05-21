import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issuesService } from "./issues.service";

const createIssues = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user.id;
    const result = await issuesService.createIssuesIntoDB(
      req.body,
      reporter_id,
    );

    sendResponse(res, {
      success: true,
      message: "Issue created successfully",
      statusCode: 201,
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      success: false,
      message: error.message,
      errors: error,
      statusCode: 500,
    });
  }
};

export const issuesController = {
  createIssues,
};
