import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  error?: string;
  data?: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>): void => {
  res.status(data.statusCode || 200).json({
    success: data.success,
    message: data.message,
    error: data.error,
    data: data.data,
  });
};

export default sendResponse;
