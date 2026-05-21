import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: string;
  data?: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>): void => {
  res.status(data.statusCode || 200).json({
    success: data.success,
    message: data.message,
    errors: data.errors,
    data: data.data,
  });
};

export default sendResponse;
