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

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await issuesService.getSingleIssueFromDB(Number(id));

    sendResponse(res, {
      success: true,
      statusCode: 200,
      data: result,
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

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const result = await issuesService.updateIssueFromDB(
      req.body,
      Number(id),
      userId as number,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issue updated successfully",
      data: result,
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

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await issuesService.deleteIssueFromDB(Number(id));

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issue deleted successfully",
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
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
